# Model
##Schemas
###Atc
```json
{
  "Code":"S",
  "Name":"S",
  "Ddd":"S"
}
```
###Matrix
```json
{
  "Id":"S", //HASH

  "Atc1":"SS",  // Plus name atc#name Only to support lecture mode
  "Atc2":"SS",  // Only to support lecture mode

  "Mec":"S", "Mechanismus":"S",
  "Eff":"S", "Effekt":"S",
  "Kli":"S", "Klinik":"S",
  "Grad":"S",

  "Pmids":"S",

  "Aia":"S","Sae":"S","Act":"S","Ate":"S","Sur":"S","Rbr":"S"
}
```
###Pubmed
```json
{
  "Pmid":"S",
  "Jou":"S",
  "Journal":"S",
  "Jahr":"S",
  "Monat":"S",
  "Author":"S",
  "Last":"S",
  "Titel":"S"
}
```