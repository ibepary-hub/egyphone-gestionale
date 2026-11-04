# Aggiornamenti EgyPhone Desktop

Il pacchetto `source.zip` contiene esclusivamente l’app Windows, nella cartella `EgyPhone-Desktop`. I file del gestionale web alla radice non sono modificati.

Quando viene caricato un pacchetto con un nuovo numero di versione, il workflow **EgyPhone Desktop Windows** esegue i test, costruisce l’installatore e pubblica installer, sorgenti e `egyphone-update.json` in un rilascio GitHub `desktop-vX.Y.Z`.

Per un aggiornamento futuro:
1. Modificare l’app Windows.
2. Incrementare soltanto la versione dell’app in package.json, nella voce root e nel pacchetto root del lockfile, in installer.nsi e build-studio.cjs. Aggiornare RELEASE-NOTES.md.
3. Eseguire i test e ricreare source.zip con la stessa cartella principale.
4. Sostituire `desktop/source.zip` e fare commit su main. Il workflow distribuisce il nuovo rilascio.

L’app controlla solo rilasci desktop pubblicati e stabili di questo repository. Non installa versioni uguali o precedenti; controlla identità, versione, dimensione, indirizzo e checksum SHA256 del pacchetto. L’utente sceglie quando scaricare e quando installare. Nessun token GitHub è incluso nell’app.

Una versione 1.6.x va installata una prima volta per introdurre il sistema. Le versioni 1.5.x non hanno il controllo aggiornamenti. La pubblicazione della sola versione corrente non mostra un popup di nuova versione a chi l’ha già installata.
