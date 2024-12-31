CREATE DATABASE tl_database;
USE tl_database;

/* Table: Operator */
CREATE TABLE Operator (
    ID INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    ADM INT,
    OP_ID VARCHAR(3)
);

/* Table: Toll Station */
CREATE TABLE TollStation (
    ID INT PRIMARY KEY,
    Road VARCHAR(255),
    Locality VARCHAR(255),
    Lat NUMERIC,
    Lon NUMERIC,
    StationID VARCHAR(6),
    OperatorID INT,
    CONSTRAINT FK_TollStation_Operator FOREIGN KEY (OperatorID) REFERENCES Operator(ID)
);

/* Table: Tag */
CREATE TABLE Tag (
    ID INT PRIMARY KEY,
    TagRef VARCHAR(20) NOT NULL,
    TagHome VARCHAR(3),
    OperatorID INT,
    CONSTRAINT FK_Tag_Operator FOREIGN KEY (OperatorID) REFERENCES Operator(ID)
);

/* Table: Transaction */
CREATE TABLE Transaction (
    ID INT PRIMARY KEY,
    Toll_ID INT,
    TagRef VARCHAR(20),
    TimeStamp TIMESTAMP NOT NULL,
    Charge NUMERIC(10, 2),
    SettlementID INT,
    TagID INT,
    TollStationID INT,
    CONSTRAINT FK_Transaction_Tag FOREIGN KEY (TagID) REFERENCES Tag(ID),
    CONSTRAINT FK_Transaction_TollStation FOREIGN KEY (TollStationID) REFERENCES TollStation(ID)
);

/* Table: Payment */
CREATE TABLE Payment (
    ID INT PRIMARY KEY,
    FromOperator INT,
    ToOperator INT,
    Amount NUMERIC(10, 2),
    OperatorID INT,
    SettlementID INT,
    CONSTRAINT FK_Payment_FromOperator FOREIGN KEY (FromOperator) REFERENCES Operator(ID),
    CONSTRAINT FK_Payment_ToOperator FOREIGN KEY (ToOperator) REFERENCES Operator(ID),
    CONSTRAINT FK_Payment_Settlement FOREIGN KEY (SettlementID) REFERENCES Settlement(ID)
);

/* Table: Settlement */
CREATE TABLE Settlement (
    OP_ID INT,
    Date TIMESTAMP NOT NULL,
    ID INT PRIMARY KEY,
    FromOperator INT,
    ToOperator INT,
    CONSTRAINT FK_Settlement_FromOperator FOREIGN KEY (FromOperator) REFERENCES Operator(ID),
    CONSTRAINT FK_Settlement_ToOperator FOREIGN KEY (ToOperator) REFERENCES Operator(ID)
);
