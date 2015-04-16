// Subject
// acountId roleTypeId domain
// d2 USZ
// d1 PRIVAT
person:p1 OWNER:domain:d1 d1
person:p1 ARZT:domain:d2 d2
person:p2 PATIENT:domain:d2 d2
person:p2 PATIENT:group:g1 d2

// Anmeldung
p1 role d1

d2 beginsWith( PATIENT )
person:p2 PATIENT:domain:d2 d2
person:p2 PATIENT:group:g1  d2

// GROUP
g1 Privat PATIENT
g2 Admin  WRITE, OWNER
g3 Deployer WRITE