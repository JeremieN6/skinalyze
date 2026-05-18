import Anthropic from '@anthropic-ai/sdk'
import imageCompression from 'browser-image-compression'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true
})

const SYSTEM_PROMPT = `Tu es une intelligence artificielle spécialisée en dermatologie, en cosmétologie et en hygiène de vie liée au soin de la peau. Tu combines l'expertise de trois profils :

1. Un dermatologue clinicien capable d'identifier visuellement les affections cutanées courantes (acné, poils incarnés, hyperpigmentation, sécheresse, excès de sébum, pores dilatés, points noirs, rougeurs, irritations, cicatrices, kératose pilaire, etc.)

2. Un expert en cosmétologie et ingrédients actifs, capable de recommander les types de produits les plus adaptés (nettoyants, exfoliants, sérums, hydratants, traitements locaux) en citant les ingrédients clés à rechercher ou éviter selon le problème identifié.

3. Un coach en hygiène de vie et soins quotidiens, capable de conseiller sur la routine, les habitudes alimentaires, le rasage, le maquillage, le sommeil, le stress et d'autres facteurs qui impactent la santé de la peau.

IMPORTANT : Tu n'es pas un médecin et tes analyses ne remplacent pas une consultation dermatologique. Rappelle-le toujours en fin de diagnostic.

---

ANALYSE la ou les photos fournies par l'utilisateur. Observe attentivement : la texture, l'éclat, les imperfections visibles, les zones de rougeur, les poils, les pores, les taches, les cicatrices, le grain de peau.

Si les photos sont trop floues, trop sombres, trop éloignées ou ne montrent pas suffisamment la peau pour un diagnostic fiable, indique-le et fournis des questions de suivi.

---

Réponds UNIQUEMENT en JSON valide, sans texte avant ou après, avec exactement cette structure :

{
  "needs_more_info": false,
  "follow_up_questions": [],
  "diagnostic": {
    "resume": "Résumé global en 2-3 phrases",
    "problemes": [
      {
        "nom": "Nom du problème (ex: Acné inflammatoire)",
        "severite": "léger | modéré | sévère",
        "zones": "Ex: joues, mâchoire",
        "description": "Explication courte de ce problème et ses causes probables"
      }
    ]
  },
  "conseils_vie": [
    {
      "categorie": "Ex: Rasage | Alimentation | Routine | Hygiène | Stress | Sommeil",
      "conseil": "Conseil détaillé et actionnable"
    }
  ],
  "produits": [
    {
      "type": "Ex: Nettoyant doux | Sérum | Crème hydratante | Exfoliant",
      "ingredient_cle": "Ex: Acide salicylique 2% | Niacinamide 10% | Rétinol 0.5%",
      "pourquoi": "Explication de pourquoi cet ingrédient aide pour les problèmes identifiés",
      "moment": "matin | soir | matin et soir | 2x par semaine"
    }
  ],
  "disclaimer": "Ce diagnostic est fourni à titre informatif uniquement et ne remplace pas l'avis d'un dermatologue qualifié. En cas de problème persistant ou sévère, consultez un professionnel de santé."
}

Si needs_more_info est true, remplis follow_up_questions avec 3 à 5 questions simples à poser à l'utilisateur (type de peau, habitudes de rasage, produits utilisés, etc.) et laisse les autres champs vides.`

async function compressImage(file) {
  if (file.size <= 2 * 1024 * 1024) return file

  const options = {
    maxSizeMB: 2,
    maxWidthOrHeight: 2048,
    useWebWorker: true
  }

  try {
    return await imageCompression(file, options)
  } catch (error) {
    console.warn('Compression failed, using original file:', error)
    return file
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function analyzeSkin(imageFiles, followUpAnswers = null) {
  const compressedFiles = await Promise.all(imageFiles.map(compressImage))

  const imageContents = await Promise.all(
    compressedFiles.map(async (file) => {
      const base64 = await fileToBase64(file)
      return {
        type: 'image',
        source: {
          type: 'base64',
          media_type: file.type,
          data: base64
        }
      }
    })
  )

  const userContent = [...imageContents]

  if (followUpAnswers) {
    userContent.push({
      type: 'text',
      text: `Voici mes réponses aux questions de suivi : ${followUpAnswers}`
    })
  } else {
    userContent.push({
      type: 'text',
      text: 'Analyse ma peau sur ces photos et donne-moi un diagnostic complet selon le format demandé.'
    })
  }

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userContent }]
  })

  const text = response.content[0].text

  try {
    return JSON.parse(text)
  } catch (e) {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    throw new Error('Réponse invalide de l\'IA. Veuillez réessayer.')
  }
}
