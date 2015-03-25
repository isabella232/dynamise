var schemas = {

    User:
    {
        "Id":"S", //HASH
        "Name":"S",
        "Email":"S", //GI
        "Ip":"S",
        "Password":"S",
        "Created":"S",
        "Updated":"S",
        "Teminated":"S"
    },
    Owner: {
        "Hash":"S",  //HASH
        "Range":"S", //RANGE
        "Name":"S"
        // user:id    | domain:sha1(id,name) | name, label, roles, start, stop
        // domain:sha1| domain:sha1(id,name) | name, label, roles, start, stop
    },
    Group: {
        // domain:sha1| ROLE:group:sha1(id,name)  | name, label, roles, start, stop
    }
    ,
    Subject: {
        //user:id | ROLE:akte:sha1 | name, label, start, stop
    },
    Object: {
        // akte:sha1 | MEDI:ISO | content
    },
    Pubmed:
    {
        "Pmid":"S",
        "Jou":"S",
        "Journal":"S",
        "Jahr":"S",
        "Monat":"S",
        "Author":"S",
        "Last":"S",
        "Titel":"S"
    },
    Atc:
    {
        "Code":"S",
        "Name":"S",
        "Ddd":"S"
    },
    // REMEMBER TO COMMENT HASH, RANGE AND INDEX
    Matrix:
    {
        "Id":"S", //HASH

        "Atc1":"SS",  // Plus name atc#name Only to support lecture mode
        "Atc2":"SS",  // Only to support lecture mode

        "Mec":"S", "Mechanismus":"S",
        "Eff":"S", "Effekt":"S",
        "Kli":"S", "Klinik":"S",
        "Grad":"S",

        "Pmids":"S",

        "Aia":"S","Sae":"S","Act":"S","Ate":"S","Sur":"S","Rbr":"S",
    }
    ,
    TestTable:
    {
        // HASH
        "UserId":"S",
        // RANGE
        "FileId":"S",
        // ATTRIBUTES
        "Name":"S",
        "Type":"S",
        "Size":"N",
        "Date":"S",
        "SharedFlag":"S",
        "S3Key":"S",
        ItemsOnMyDesk: "L",
        Pens: "M",
        Quantity: "N",
        "testList":"L",
        "testBoolean":"BOOL",
        "testAttributeString":"S",
        "testAttributeStringSet":"SS",
        "testAttributeNumber":"N",
        "testAttributeNumberSet":"NS",
        "testAttributeBinary":"B",
        "testAttributeBinarySet":"BS"
    }
};

module.exports = schemas;