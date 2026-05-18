import LegalShell from '@/app/_components/legal-shell';

export default function PrivacyPage() {
  return (
    <LegalShell title="Politique de confidentialité">
      <h2>1. Responsable du traitement</h2>
      <p>
        Skinalyze est responsable du traitement de vos données personnelles.
        Contact : <a href="mailto:contact@skinalyze.fr">contact@skinalyze.fr</a>
      </p>

      <h2>2. Données collectées</h2>
      <p>Nous collectons uniquement les données nécessaires au fonctionnement du service :</p>
      <ul>
        <li><strong>Photos de peau</strong> : transmises pour analyse, supprimées immédiatement après traitement.</li>
        <li><strong>Données de formulaire</strong> : nom, email professionnel, entreprise (uniquement si vous soumettez une demande de démo).</li>
        <li><strong>Données de navigation</strong> : identifiant anonyme (UUID stocké en localStorage), événements d'utilisation anonymisés.</li>
      </ul>

      <h2>3. Finalités</h2>
      <ul>
        <li>Génération du rapport de diagnostic cutané.</li>
        <li>Traitement des demandes de démo et contact commercial.</li>
        <li>Amélioration du service (statistiques anonymisées).</li>
      </ul>

      <h2>4. Conservation des données</h2>
      <p>
        Les photos sont supprimées immédiatement après analyse. Les données de formulaire sont conservées
        pendant 3 ans à compter de leur collecte. Les données de navigation anonymisées sont conservées 12 mois.
      </p>

      <h2>5. Partage des données</h2>
      <p>
        Vos données ne sont pas vendues ni partagées avec des tiers à des fins commerciales.
        Nous utilisons des sous-traitants techniques (hébergement cloud, IA) soumis aux mêmes obligations de confidentialité.
      </p>

      <h2>6. Vos droits</h2>
      <p>
        Conformément au RGPD, vous disposez des droits d'accès, de rectification, d'effacement, de portabilité
        et d'opposition. Pour exercer ces droits : <a href="mailto:contact@skinalyze.fr">contact@skinalyze.fr</a>
      </p>
      <p>
        Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).
      </p>

      <h2>7. Cookies</h2>
      <p>
        Nous utilisons uniquement des cookies techniques strictement nécessaires au fonctionnement du service
        (session administrateur). Aucun cookie publicitaire ou de tracking tiers n'est utilisé.
      </p>
    </LegalShell>
  );
}
