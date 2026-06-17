import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getOrCreateUser, getQuotaAndRemaining, recordUsage } from '@/lib/subscriptions';
import { getAuthUserIdFromRequest } from '@/lib/user-auth';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { images, followUp, userId: clientUserId } = payload;
    const cookieUserId = getAuthUserIdFromRequest(req);

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }

    // Server-side quota enforcement: authenticated cookie first, then legacy payload userId.
    let serverUserId: string | null = null;
    const effectiveUserId = cookieUserId || clientUserId;
    if (effectiveUserId) {
      const user = await getOrCreateUser(effectiveUserId);
      serverUserId = user?.user_id ?? null;
      if (serverUserId) {
        const quota = await getQuotaAndRemaining(serverUserId);
        if (quota.quota !== -1 && quota.remaining <= 0) {
          return NextResponse.json({ error: 'Quota exceeded' }, { status: 402 });
        }
      }
    }

    const imageBlocks: Anthropic.ImageBlockParam[] = images.slice(0, 3).map((dataUrl: string) => {
      const [, rest] = dataUrl.split(',');
      const mediaTypeMatch = dataUrl.match(/data:([^;]+);/);
      const mediaType = (mediaTypeMatch?.[1] ?? 'image/jpeg') as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
      return {
        type: 'image',
        source: { type: 'base64', media_type: mediaType, data: rest },
      };
    });

    const followUpText = followUp ? `\n\nInformations complémentaires du client : ${followUp}` : '';

    const prompt = `Tu es un expert en diagnostic cutané combinant les expertises d'un dermatologue, d'un cosmétologue et d'un coach bien-être.

Analyse la/les photo(s) de peau fournie(s) et génère un rapport structuré en 3 parties.${followUpText}

Réponds UNIQUEMENT avec un JSON valide dans ce format exact (sans markdown, sans explication autour) :
{
  "diagnosis": {
    "title": "Ce qu'on observe sur votre peau",
    "summary": "...",
    "findings": [
      {
        "title": "...",
        "zones": "Zones : ...",
        "severity": "Modéré",
        "description": "..."
      }
    ]
  },
  "routine": {
    "title": "Votre routine personnalisée",
    "items": [
      {
        "label": "Protection solaire",
        "description": "..."
      }
    ]
  },
  "products": {
    "title": "Les produits qu'il vous faut",
    "items": [
      {
        "name": "Nettoyant doux",
        "badge": "soir",
        "accent": "Acide salicylique 0.5-2%",
        "description": "..."
      }
    ]
  }
}

Pour chaque section, fournis un contenu détaillé, concret et personnalisé. Dans la première section, indique clairement la sévérité avec des valeurs courtes comme "Modéré" ou "Léger". Dans la dernière section, mets toujours un badge court comme "matin", "soir" ou "matin et soir", puis une ligne d'accent courte sous le nom du produit.`;

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: [
            ...imageBlocks,
            { type: 'text', text: prompt },
          ],
        },
      ],
    });

    const textContent = response.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    const raw = textContent.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(raw);

    try {
      if (serverUserId) {
        await recordUsage(serverUserId);
      }
    } catch (e) {
      console.warn('Failed to record usage', e);
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Diagnostic API error:', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
