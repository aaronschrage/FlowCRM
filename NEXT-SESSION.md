# Volgende sessie - waar we gebleven zijn

## Ontdekking
Twee FlowCRM mappen gevonden:
- /Users/aaronschrage/FlowCRM (HOME) - oude versie, gebruikt Clerk auth
- /Users/aaronschrage/Desktop/FlowCRM (DESKTOP) - actuele GitHub versie, gebruikt magic link voor portal

## Status home versie
- v1 + afwijkende v2 commit + proxy.ts fix vandaag (Clerk public routes)
- Niet gepusht, divergeert van GitHub na 9f8045b

## Status desktop versie
- Up to date met GitHub
- Bevat portaal, marketing pagina, magic link auth
- proxy.ts bewaakt alleen /portal via JWT
- Admin auth methode nog niet onderzocht

## Volgende sessie - start hier
1. Onderzoek hoe admin auth werkt in Desktop versie (Clerk? NextAuth? eigen?)
2. Beslis: home versie weggooien of cherry-picken
3. Daarna pas verder met auth + multi-tenant audit
