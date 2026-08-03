# But what is a neural network? | Deep learning chapter 1

- **Autore:** 3Blue1Brown
- **URL YouTube:** https://youtu.be/aircAruvnKk
- **Temi trattati:** —
- **Fonte del testo:** sottotitoli en
- **Data di elaborazione:** 03/08/2026

## Abstract

Il video di 3Blue1Brown esplora il concetto di rete neurale, rendendo accessibile la sua struttura e il funzionamento attraverso l'analisi del riconoscimento delle cifre scritte a mano. Gli obiettivi formativi includono la comprensione dei neuroni, dei layer e delle funzioni di attivazione, illustrando come le reti possano scomporre problemi complessi in componenti più semplici. Target di riferimento sono studenti e appassionati di deep learning, interessati a scoprire le basi delle reti neurali e il loro funzionamento attraverso un approccio visivo e intuitivo.

# Perché riconoscere un numero è facile per il cervello e difficile per un programma

## Il problema del riconoscimento delle cifre scritte a mano

Riconoscere un **3** è un compito naturale per il cervello umano anche quando l’immagine è disordinata, ruotata o resa con pochi pixel. Per un essere umano, diverse versioni dello stesso numero vengono percepite come lo stesso oggetto mentale, anche se i dettagli visivi cambiano molto. Questa capacità mostra quanto sia sofisticata la percezione visiva.

Per un programma, invece, il problema è molto più impegnativo: bisogna trasformare una griglia di **28×28 pixel** in un singolo output che indichi quale cifra è rappresentata. Il punto centrale non è solo classificare un’immagine, ma costruire un sistema capace di riconoscere pattern diversi come appartenenti alla stessa categoria.

> **BOX – Riconoscimento visivo umano vs computazionale**  
> Il cervello generalizza senza difficoltà da forme diverse dello stesso oggetto. Un algoritmo, invece, deve essere progettato per imparare questa capacità da esempi.

## Obiettivo della serie: capire cos’è una rete neurale come struttura

L’intento del video è spiegare **che cosa sia davvero una rete neurale**, senza dare per scontate conoscenze pregresse. L’attenzione è sulla **struttura** della rete, non ancora sul processo di apprendimento: il tema del learning verrà affrontato separatamente.

L’autore vuole anche mostrare che una rete neurale non è un termine magico o generico, ma un insieme preciso di elementi matematici. Comprendere questa struttura serve a dare senso a espressioni come **“una rete neurale ha imparato”**, che altrimenti restano astratte.

## Una rete neurale “semplice” per capire la logica di base

Il modello presentato è la forma più essenziale di rete neurale, spesso chiamata **plain vanilla**: una versione base, senza varianti avanzate. L’idea è partire da una configurazione semplice, perché è il punto di ingresso necessario per capire anche le architetture più moderne.

Nonostante la semplicità, questa rete è già capace di riconoscere cifre scritte a mano. Il video mostra anche che il modello, pur funzionando, ha dei limiti: non realizza tutte le aspettative intuitive che si potrebbero avere da una “macchina intelligente”.

> **BOX – Rete neurale semplice**  
> Una rete neurale è un sistema di unità collegate tra loro che trasforma un input in un output. Anche nella forma più semplice, può già imparare compiti visivi non banali come il riconoscimento delle cifre.

# Struttura di una rete neurale per riconoscere cifre

## Cosa sono i neuroni in questo contesto

Qui la parola **neurone** non indica un neurone biologico in senso stretto. Indica semplicemente una unità che contiene un numero compreso tra **0 e 1**. Questa quantità si chiama **attivazione**.

L’idea intuitiva è che un neurone “si accende” di più quando la sua attivazione è alta. Nel caso delle immagini, l’attivazione può rappresentare la luminosità di un pixel o il grado con cui il sistema ritiene presente una certa caratteristica.

> **BOX – Attivazione**  
> L’**attivazione** è il valore numerico contenuto in un neurone. Più è vicino a 1, più l’unità è considerata “fortemente attiva”; più è vicino a 0, meno contribuisce.

## Il livello di input: 784 neuroni per un’immagine 28×28

La prima layer della rete corrisponde ai pixel dell’immagine in ingresso. Poiché l’immagine è una griglia di **28×28 pixel**, servono **784 neuroni** di input, uno per ogni pixel.

Ogni neurone riceve un valore che rappresenta la luminosità del pixel corrispondente: **0** per il nero, **1** per il bianco, con valori intermedi per le tonalità di grigio. In pratica, la rete vede l’immagine come una lunga lista di numeri, non come un oggetto visivo.

## Il livello di output: 10 neuroni per le 10 cifre

L’ultima layer contiene **10 neuroni**, uno per ciascuna cifra da 0 a 9. L’attivazione di questi neuroni rappresenta quanto la rete ritiene che l’immagine appartenga a ciascuna categoria.

Il neurone più attivo nell’output corrisponde alla scelta finale del sistema. Se, ad esempio, il neurone associato al **3** è quello con attivazione maggiore, la rete “decide” che l’immagine rappresenta un 3.

## I layer nascosti: il punto davvero interessante

Tra input e output ci sono i **hidden layers**, cioè i **layer nascosti**. Il loro ruolo è trasformare gradualmente i pixel in una rappresentazione utile per la classificazione finale. Sono chiamati “nascosti” perché non corrispondono direttamente né ai pixel né alle categorie finali.

Nel modello mostrato ci sono **due layer nascosti**, ognuno con **16 neuroni**. Questa scelta non è presentata come unica o obbligata: il numero di layer e di neuroni è in parte una decisione di progetto, e nella pratica esiste ampio margine di sperimentazione.

> **BOX – Layer nascosti**  
> I **layer nascosti** sono gli strati intermedi della rete. Servono a costruire rappresentazioni via via più utili del dato di partenza, prima della decisione finale.

## Come funziona il passaggio da un layer al successivo

Il principio di base è che le **attivazioni di un layer determinano quelle del layer successivo**. La rete elabora quindi l’informazione in modo sequenziale: dall’input ai primi intermedi, poi agli strati successivi, fino all’output.

Il cuore del modello sta proprio in questa trasformazione. La domanda decisiva non è solo “quali neuroni esistono?”, ma **come l’attivazione di un livello produce l’attivazione del livello dopo**. Il video introduce questo punto come il vero meccanismo che rende la rete utile per l’elaborazione dell’informazione.

## Perché una struttura a strati può funzionare

L’autore propone un’analogia con il modo in cui noi riconosciamo i numeri. Quando vediamo un **9**, non lo interpretiamo come un insieme casuale di pixel, ma come la combinazione di elementi più semplici: per esempio **un anello nella parte alta** e **una linea sul lato destro**.

Allo stesso modo, un **8** condivide con il 9 la presenza di una parte “ad anello” in alto, ma aggiunge un altro anello nella parte bassa. Un **4**, invece, può essere visto come una composizione di **tre linee specifiche**. L’idea di fondo è che un sistema intelligente possa ricomporre i dati a partire da componenti elementari.

## L’ipotesi sui neuroni intermedi: riconoscere subcomponenti

L’aspettativa più naturale è che i neuroni del penultimo layer imparino a rispondere a **subcomponenti** delle cifre, non alle cifre complete. Per esempio, un neurone potrebbe attivarsi quando compare una forma “a loop” nella parte alta dell’immagine, indipendentemente dal fatto che si tratti di un 8 o di un 9.

Non si tratterebbe di un singolo loop identico in ogni immagine, ma di una forma generale: qualunque configurazione sufficientemente simile potrebbe attivare quel neurone. In questo modo, il layer finale avrebbe il compito relativamente semplice di combinare questi segnali intermedi per decidere quale cifra è presente.

## Il problema si può scomporre ancora: dalle forme ai bordi

L’idea di riconoscere un loop può essere ulteriormente scomposta. Un loop non è altro che un insieme di **piccoli bordi** o tratti elementari messi insieme in una configurazione particolare. In modo analogo, una linea lunga come quelle presenti in **1**, **4** o **7** può essere vista come un segmento continuo o come una sequenza di bordi più piccoli.

Questo suggerisce una gerarchia di rappresentazioni: prima elementi semplici, poi forme più complesse, infine la cifra completa. La rete neurale a strati è interessante proprio perché tenta di costruire questo tipo di rappresentazione progressiva.

> **BOX – Rappresentazione gerarchica**  
> Una rete neurale può essere pensata come un sistema che passa da elementi semplici a strutture più complesse. I layer intermedi servono a costruire questa gerarchia di caratteristiche.

## Dalla percezione di bordi alla costruzione di rappresentazioni gerarchiche

Un’idea centrale è che una rete neurale può trasformare un’immagine grezza in una sequenza di rappresentazioni sempre più astratte. Se il primo livello rileva pixel, un livello successivo può combinare quei pixel per riconoscere **bordi**, un altro può combinare i bordi in **forme**, e ancora un altro può arrivare a riconoscere **cifre** o altri oggetti complessi.  
Questa struttura a strati rende plausibile l’uso della rete non solo per il riconoscimento di immagini, ma per molti compiti intelligenti che si prestano a una lettura gerarchica.

> **BOX – Rappresentazione gerarchica**  
> Una **rappresentazione gerarchica** organizza l’informazione in livelli di astrazione: elementi semplici si combinano in strutture più complesse. Nel video l’esempio è visivo, ma lo stesso principio viene richiamato anche per il parlato.

L’autore collega infatti questa logica ad altri domini, come il riconoscimento vocale: dal segnale audio grezzo si estraggono suoni distinti, poi sillabe, poi parole, poi frasi e idee più astratte. L’intuizione è che un sistema “a strati” sia adatto quando il compito richiede di comporre progressivamente unità semplici in strutture più ricche.

## Come una rete può riconoscere un bordo o un dettaglio locale

Per rendere concreto il meccanismo, si immagina un neurone del secondo livello incaricato di rilevare se in una certa regione dell’immagine è presente un **bordo**. La domanda non è ancora come la rete impari, ma quali **parametri** deve possedere per poter esprimere questo tipo di riconoscimento.

La risposta è assegnare un **peso** a ciascuna connessione tra quel neurone e i neuroni del livello precedente. I pesi sono numeri che indicano quanto conta ogni ingresso. Il neurone non “vede” direttamente l’immagine: riceve un insieme di attivazioni, le combina tramite una media ponderata e produce una nuova attivazione.

### Pesi positivi e negativi

L’autore visualizza i pesi come una piccola griglia:  
- **verde** per i pesi positivi;  
- **rosso** per i pesi negativi;  
- intensità del colore come indicazione approssimativa del valore del peso.

Se solo alcuni pixel centrali devono contribuire al riconoscimento, i pesi significativi saranno concentrati lì, mentre molti altri saranno vicini a zero. In questo modo il neurone risponde soprattutto a una certa zona dell’immagine, ignorando il resto.

Se invece si vuole riconoscere un **bordo**, si possono usare pesi positivi su una parte della regione e pesi negativi sui pixel circostanti. Il risultato è alto quando la parte centrale è chiara e l’intorno è scuro, cioè quando emerge una differenza tipica di un contorno.

> **BOX – Peso**  
> Il **peso** è il parametro che stabilisce quanto una connessione influenza il neurone successivo. Pesi diversi permettono al neurone di specializzarsi su pattern diversi: un bordo, un angolo, una zona luminosa, una combinazione di tratti.

## Dalla somma pesata all’attivazione tra 0 e 1

La combinazione degli ingressi produce una **somma pesata**, cioè la somma delle attivazioni precedenti moltiplicate per i rispettivi pesi. Questa somma, però, può assumere qualsiasi valore reale. Nel modello descritto, invece, si vuole che l’attivazione finale del neurone stia tra **0 e 1**.

Per ottenere questo comportamento si applica una funzione di “schiacciamento” detta **sigmoide** o **curva logistica**. La sigmoide manda valori molto negativi vicino a 0, valori positivi vicino a 1, e cresce gradualmente attorno allo zero. In pratica trasforma la somma pesata in una misura di quanto il neurone sia “attivo”.

> **BOX – Funzione sigmoide**  
> La **sigmoide** è una funzione che comprime qualsiasi numero reale nell’intervallo tra 0 e 1. Nel contesto della rete neurale, l’uscita del neurone diventa interpretabile come grado di attivazione.

Questa uscita si può leggere come una misura di quanto la combinazione di segnali in ingresso supporti l’ipotesi che il pattern cercato sia presente. Più il valore è alto, più il neurone “crede” che il suo pattern di riferimento sia stato trovato.

## Il ruolo del bias: accendere il neurone solo oltre una soglia

Non sempre basta che la somma pesata sia maggiore di zero. A volte si vuole che il neurone resti quasi spento finché il segnale non supera una certa soglia. Per ottenere questo comportamento si aggiunge un **bias**, cioè un numero ulteriore che si somma prima della sigmoide.

Nel linguaggio intuitivo dell’autore, il bias rappresenta un **pregiudizio verso l’inattività**: rende più difficile l’attivazione del neurone. Ad esempio, se si aggiunge un bias pari a -10, la somma pesata dovrà essere abbastanza grande da compensare quel valore negativo prima che il neurone inizi ad attivarsi in modo significativo.

> **BOX – Bias**  
> Il **bias** è un termine aggiuntivo che sposta la soglia di attivazione del neurone. Serve a decidere quanto forte deve essere la somma dei segnali in ingresso prima che il neurone risponda davvero.

Pesi e bias hanno quindi ruoli distinti ma complementari. I **pesi** dicono **che cosa** il neurone sta cercando; il **bias** dice **quanto facilmente** il neurone si accende.

## Molti parametri, molti gradi di libertà

Ogni neurone del secondo livello è collegato a tutti i **784 neuroni-pixel** del primo livello, e ognuna di queste connessioni ha il proprio peso. Se il livello nascosto contiene **16 neuroni**, il numero di pesi tra primo e secondo livello diventa molto grande: 784 per 16, più 16 bias.

Questo è solo un tratto della rete. Anche le connessioni tra gli altri livelli hanno i loro pesi e bias. Nel complesso, la rete descritta contiene circa **13.000 parametri** tra pesi e bias, cioè 13.000 possibili “manopole” da regolare.

La conseguenza concettuale è importante: **imparare** significa trovare una configurazione valida di tutti questi numeri, tale da far funzionare la rete nel compito assegnato. Il problema dell’apprendimento non è quindi “costruire” la rete a mano, ma trovare automaticamente i valori giusti per i suoi parametri.

## L’idea, teoricamente affascinante, di impostare tutto a mano

L’autore propone un esperimento mentale insieme affascinante e inquietante: immaginare di regolare manualmente tutti i pesi e i bias. In questa visione, si potrebbero progettare i neuroni del secondo livello per riconoscere bordi, quelli del terzo per riconoscere pattern più complessi, e così via.

Questa immagine è utile perché rende la rete meno opaca. Se si capisce almeno in parte che cosa rappresentano i parametri, si dispone di un punto di partenza per intervenire quando la rete non si comporta come previsto. Allo stesso modo, se la rete funziona ma per ragioni diverse da quelle immaginate, leggere i parametri aiuta a mettere alla prova le proprie ipotesi.

## Scrivere la rete in forma compatta: vettori e matrici

La formula esplicita delle connessioni può diventare ingombrante. Per questo, nella letteratura sulle reti neurali, si usa una notazione più compatta basata su **vettori** e **matrici**.

Le attivazioni di un livello si raccolgono in un **vettore colonna**. I pesi si organizzano in una **matrice**, in cui ogni riga rappresenta le connessioni verso un neurone del livello successivo. La somma pesata di tutti gli ingressi corrisponde allora a un **prodotto matrice-vettore**.

> **BOX – Matrice dei pesi**  
> La **matrice dei pesi** raccoglie in forma ordinata tutte le connessioni tra due livelli della rete. Questa notazione rende più semplice descrivere e calcolare il passaggio di informazione da uno strato al successivo.

Anche i bias vengono raccolti in un **vettore** separato, che si aggiunge al risultato del prodotto matrice-vettore. In questo modo l’intero passaggio tra due livelli si scrive in modo più pulito e compatto.

## Applicare la sigmoide a ogni componente dell’uscita

Dopo aver sommato il vettore dei bias al risultato del prodotto matrice-vettore, si applica la sigmoide all’insieme. L’idea è che la funzione non agisca su un unico numero, ma venga applicata **componente per componente** al vettore risultante.

Questo passaggio completa la trasformazione tra livelli: da un insieme di attivazioni in ingresso si ottiene un nuovo insieme di attivazioni in uscita, ciascuna già compressa nell’intervallo tra 0 e 1. La rete, così descritta, diventa una sequenza di trasformazioni lineari seguite da una non linearità.

> **BOX – Trasformazione di livello**  
> Un livello della rete prende un vettore di attivazioni, lo combina con una matrice di pesi, aggiunge un vettore di bias e applica una funzione non lineare. È questa combinazione che permette alla rete di costruire rappresentazioni sempre più ricche.

# La rete neurale come funzione: forma compatta, parametri e calcolo

Quando si scrivono **matrici dei pesi** e **vettori di bias** come simboli separati, il passaggio delle attivazioni da uno strato al successivo si esprime in una formula molto compatta. Questa notazione non è solo elegante: rende anche il codice più semplice e più veloce, perché molte librerie sono altamente ottimizzate per la **moltiplicazione tra matrici**.

## I neuroni non sono “contenitori” statici, ma funzioni

Un neurone non va pensato solo come un punto che “contiene” un numero. Il valore che produce dipende dall’input ricevuto, cioè dai risultati di tutti i neuroni dello strato precedente. In questo senso, ogni neurone è meglio descritto come una **funzione**: prende in ingresso un insieme di valori e restituisce un numero tra **0 e 1**.

> **BOX – Neurone come funzione**
> Un neurone è una trasformazione che riceve gli output dello strato precedente, calcola una combinazione pesata, aggiunge un bias e applica una funzione di attivazione. Il suo output non è fisso: cambia in base all’input.

## La rete intera è una funzione molto grande

L’intera rete neurale può essere vista come **una sola funzione**: riceve **784 numeri in ingresso** e produce **10 numeri in uscita**. Nel caso presentato, si tratta di una funzione estremamente complessa, costruita tramite circa **13.000 parametri** tra pesi e bias, e attraverso molte operazioni di matrice e vettore insieme alla funzione sigmoide.

La complessità non è un difetto: è ciò che permette alla rete di affrontare un compito difficile come il riconoscimento delle cifre. Se la funzione fosse troppo semplice, non avrebbe abbastanza capacità per distinguere pattern visivi così vari.

## Il ruolo dei parametri: pesi e bias

I **pesi** e i **bias** sono i parametri che determinano come la rete reagisce agli input. I pesi indicano quanto conta ciascun segnale in ingresso; i bias spostano la soglia di attivazione del neurone. Insieme, questi valori permettono alla rete di adattarsi ai dati e di riconoscere configurazioni utili.

La formula compatta che li riassume rende visibile il fatto che il comportamento della rete non dipende da un insieme di regole scritte a mano, ma da parametri numerici che verranno poi appresi dai dati.

## Dalla sigmoide alle funzioni di attivazione moderne

La funzione **sigmoide** è stata molto usata nei primi modelli: comprime il valore ottenuto dal neurone nell’intervallo tra **0 e 1**, in linea con l’analogia biologica di neuroni che risultano più o meno attivi. In questa prospettiva, la rete produce un’uscita “ammorbidita”, utile per interpretare l’attivazione come una sorta di grado di presenza del segnale.

> **BOX – Sigmoide**
> La **sigmoide** trasforma un numero reale in un valore compreso tra 0 e 1. Nei modelli più vecchi serviva a rappresentare l’idea di un neurone che si attiva gradualmente, ma oggi è meno usata perché più difficile da addestrare in reti profonde.

## Perché oggi si usa spesso ReLU

Nelle reti moderne la **sigmoide** è stata in gran parte sostituita da **ReLU**, acronimo di **rectified linear unit**. ReLU calcola semplicemente il massimo tra **0** e il valore in ingresso: se il segnale è positivo, lo lascia passare; se è negativo, lo porta a zero.

Questa scelta è più semplice e, soprattutto, spesso **più facile da addestrare**. L’idea di fondo resta simile all’analogia biologica: un neurone può non attivarsi affatto sotto una certa soglia, oppure trasmettere il segnale sopra soglia. In pratica, ReLU ha funzionato molto bene nelle reti neurali profonde, dove la sigmoide creava maggiori difficoltà di training.

## Il significato didattico della complessità

La rete presentata è volutamente un oggetto complesso: molti strati, molti parametri, molte moltiplicazioni tra matrici. Questa complessità serve a mostrare che il problema del riconoscimento delle cifre non si risolve con una regola semplice, ma con una funzione capace di combinare tanti segnali elementari in modo strutturato.

Il punto centrale è che, nonostante la struttura sofisticata, la rete resta comunque **una funzione matematica**. Questa idea unifica tutto il modello: input, pesi, bias, attivazioni e output possono essere letti come parti di una stessa trasformazione.

## Apprendere i parametri dai dati

Resta aperta la domanda decisiva: **come fa la rete a trovare i pesi e i bias giusti semplicemente osservando dati?** Il video segnala che questo sarà l’argomento del passaggio successivo. Qui il focus è soprattutto sulla struttura della rete e sul fatto che il suo comportamento dipende da parametri apprendibili, non da istruzioni esplicite scritte a mano.

La rete, quindi, non “sa” riconoscere le cifre in partenza. Diventa capace di farlo solo quando i suoi parametri vengono regolati in modo opportuno attraverso l’apprendimento.

## Chiarimento finale sul passaggio da sigmoid a ReLU

Nel commento conclusivo con Lisha Li viene ribadito che l’uso della **sigmoide** era legato anche a una lettura biologica dei neuroni: attivi o inattivi, con una transizione smussata nell’intervallo 0–1. Tuttavia, nei modelli moderni questa funzione è meno diffusa perché **ReLU** è più semplice da ottimizzare.

La distinzione è importante: la sigmoide non è “sbagliata”, ma in molte architetture profonde si è rivelata meno efficiente. ReLU ha offerto una soluzione pratica, semplice e molto efficace per l’addestramento di reti con molti strati.

## Punti chiave da ricordare

- Una rete neurale per riconoscere cifre trasforma 784 valori di input in 10 possibili output, uno per ogni cifra.
- I neuroni non sono contenitori biologici, ma unità che producono un’attivazione tra 0 e 1 in base agli input ricevuti.
- I layer nascosti servono a costruire rappresentazioni gerarchiche: da pixel e bordi fino a forme più complesse e cifre.
- Pesi e bias determinano il comportamento della rete: i pesi indicano cosa conta, il bias sposta la soglia di attivazione.
- La rete intera può essere vista come una funzione matematica grande e parametrica; oggi spesso si usa ReLU al posto della sigmoide perché più facile da addestrare.

## Approfondimenti suggeriti

- Nel video non sono stati indicati approfondimenti specifici, ma si suggerisce di esplorare la letteratura introduttiva sulle reti neurali, in particolare sui concetti di layer, pesi, bias, funzione sigmoide e ReLU.

## Applicazioni pratiche

- Un/una HR può usare questi concetti per comprendere, a livello di base, come un sistema automatico classifica dati visivi o numerici tramite esempi e parametri.
- Un manager può cogliere che un modello di rete neurale non segue regole esplicite scritte a mano, ma dipende da una struttura di trasformazioni e da parametri da apprendere.
- Un team leader può usare l’idea di rappresentazione gerarchica per spiegare come problemi complessi possano essere scomposti in passaggi successivi più semplici.
- Uno studente può ripassare la distinzione tra input, layer nascosti, output, pesi, bias e funzione di attivazione per capire la logica di base di una rete neurale.