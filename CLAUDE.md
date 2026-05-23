# CLAUDE.md -- Memoire Projet

> Ce fichier est lu automatiquement par l'IA au debut de chaque conversation.
> Mets-le a jour a la fin de chaque session de travail.

---

## Objectif Final
<!-- A completer -->

---

## Stack Technique
<!-- A completer -->

---

## Etat Actuel du Projet
**Phase** : Transition vers la version Next.js
**Derniere session** : 2026-05-23
**Progression globale** : 15%

### Ce qui est fait :
- [x] Configuration MCP memoire
- [x] Archive de l ancienne branche `main` B2C creee sur `archive/main-v1-b2c-20260523`
- [x] Publication de `feature/nextjs-redesign` sur `main`
- [x] Verification des references distantes `origin/main` et `origin/archive/main-v1-b2c-20260523`

### Prochaines etapes :
- [ ] Definir l objectif final produit dans ce document
- [ ] Completer la stack technique du projet
- [ ] Continuer la migration et la stabilisation de la version Next.js/B2B

---

## Blocages et Points d Attention
<!-- Lister ici -->

---

## Decisions Prises
| Date | Decision | Raison |
|------|----------|--------|
| 2026-05-23 | Archiver l ancienne `main` B2C dans `archive/main-v1-b2c-20260523` avant bascule | Conserver un point de restauration clair de la v1 avant remplacement |
| 2026-05-23 | Faire pointer `main` sur le travail de `feature/nextjs-redesign` | Faire de la refonte Next.js la nouvelle branche principale du projet |

---

## Notes de Session
> Ajouter ici un resume a la fin de chaque session de travail.

- 2026-05-23 : verification de l etat Git local et distant, creation de la branche d archive `archive/main-v1-b2c-20260523` depuis l ancienne `main`, puis push de `feature/nextjs-redesign` sur `main`. Verification finale effectuee : `origin/main` pointe sur `a59a28a` et l archive pointe sur `c2ad3df`.
