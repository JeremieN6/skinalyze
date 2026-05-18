import LegalShell from '@/app/_components/legal-shell';

export default function CguPage() {
  return (
    <LegalShell title="Conditions Générales d'Utilisation">
      <h2>1. Objet</h2>
      <p>
        Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du service Skinalyze,
        accessible via le site web skinalyze.fr. En accédant au service, vous acceptez sans réserve les présentes conditions.
      </p>

      <h2>2. Description du service</h2>
      <p>
        Skinalyze est un outil d'analyse cutanée assistée par intelligence artificielle, destiné aux professionnels
        de la beauté (instituts, spas, centres esthétiques). Le service génère des rapports indicatifs à partir
        de photos transmises par l'utilisateur.
      </p>
      <p>
        Les résultats fournis par Skinalyze sont à titre informatif uniquement et ne constituent pas un avis médical.
        Ils ne remplacent en aucun cas une consultation médicale ou dermatologique.
      </p>

      <h2>3. Conditions d'accès</h2>
      <p>
        L'accès au service est réservé aux professionnels majeurs. L'offre gratuite permet 3 diagnostics.
        Au-delà, un abonnement payant est requis.
      </p>

      <h2>4. Propriété intellectuelle</h2>
      <p>
        L'ensemble des contenus du site (textes, visuels, code, marque) est la propriété exclusive de Skinalyze.
        Toute reproduction sans autorisation écrite est interdite.
      </p>

      <h2>5. Protection des données personnelles</h2>
      <p>
        Les photos transmises pour analyse sont traitées en temps réel et supprimées immédiatement après génération
        du rapport. Aucune image n'est conservée sur nos serveurs. Consultez notre Politique de confidentialité
        pour plus d'informations.
      </p>

      <h2>6. Responsabilité</h2>
      <p>
        Skinalyze ne saurait être tenu responsable des dommages directs ou indirects liés à l'utilisation du service,
        notamment des décisions prises sur la base des rapports générés.
      </p>

      <h2>7. Droit applicable</h2>
      <p>
        Les présentes CGU sont soumises au droit français. En cas de litige, les tribunaux compétents sont ceux
        du ressort du siège social de Skinalyze.
      </p>

      <h2>8. Contact</h2>
      <p>Pour toute question : <a href="mailto:contact@skinalyze.fr">contact@skinalyze.fr</a></p>
    </LegalShell>
  );
}
