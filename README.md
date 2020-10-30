# Corona-Ergebnis.de Checker

Skript zur Test-Status Überprüfung von corona-ergebnis.de

---

## Anleitung

Die eigenen Testdaten zur Abfrage in `CONFIG.js` eintragen.


Einfache Überprüfung auf der Konsole mit

```
node .\check-result.js
> Covid test result available: FALSE
```

## Erweiterung

Das Skript kann einfach um eine eigene Benachrichtigung erweitert werden.

```
const checkResult = require('./check-result.js');

let resultAvailable = checkResult();
if(resultAvailable) {
	// TODO, custom notification
}
```
