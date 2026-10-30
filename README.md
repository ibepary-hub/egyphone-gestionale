# Egyphone · pubblicazione separata (preparazione)

Questo repository è destinato esclusivamente a un futuro deployment indipendente di Egyphone su `egyphone.beparytech.it`.

## Stato

- Repository creato, ancora **non pubblicato**.
- Non contiene il codice del gestionale né dati dei clienti.
- Non puntare il DNS qui prima di configurare GitHub Pages e il dominio personalizzato.
- Non copiare dati o configurazioni di BeparyTech nel repository.
- Verificare backup del database, protezione RLS per workspace e flussi login/logout prima del rilascio.

## Vincoli

Mantenere `gestionale.beparytech.it` e il suo repository invariati finché il secondo sito non è collaudato. La separazione dei domini isola l'archiviazione locale delle sessioni nel browser; l'isolamento dei dati richiede inoltre autorizzazioni Supabase e RLS corrette.
