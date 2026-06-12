-- pinvbrand
IF NOT EXISTS (
    SELECT 1 FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = N'dbo' AND t.name = N'pinvbrand'
)
BEGIN
    CREATE TABLE dbo.pinvbrand (
        iBrandId INT IDENTITY(1,1) NOT NULL,
        vName VARCHAR(255) NOT NULL,
        bActive BIT NOT NULL,
        CONSTRAINT PK_pinvbrand PRIMARY KEY (iBrandId)
    );
END

-- pinvmodel
IF NOT EXISTS (
    SELECT 1 FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = N'dbo' AND t.name = N'pinvmodel'
)
BEGIN
    CREATE TABLE dbo.pinvmodel (
        iModelId INT IDENTITY(1,1) NOT NULL,
        iBrandId INT NOT NULL,
        vName VARCHAR(255) NOT NULL,
        bActive BIT NOT NULL,
        CONSTRAINT PK_pinvmodel PRIMARY KEY (iModelId),
        CONSTRAINT FK_pinvmodel_pinvbrand FOREIGN KEY (iBrandId) REFERENCES dbo.pinvbrand(iBrandId)
    );
END

-- pinvcategory
IF NOT EXISTS (
    SELECT 1 FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = N'dbo' AND t.name = N'pinvcategory'
)
BEGIN
    CREATE TABLE dbo.pinvcategory (
        iCategoryId BIGINT IDENTITY(1,1) NOT NULL,
        vName VARCHAR(255) NOT NULL,
        bActive BIT NOT NULL,
        CONSTRAINT PK_pinvcategory PRIMARY KEY (iCategoryId)
    );
END

-- pinvsupplier
IF NOT EXISTS (
    SELECT 1 FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = N'dbo' AND t.name = N'pinvsupplier'
)
BEGIN
    CREATE TABLE dbo.pinvsupplier (
        iSupplierId BIGINT IDENTITY(1,1) NOT NULL,
        vName VARCHAR(255) NOT NULL,
        bActive BIT NOT NULL,
        CONSTRAINT PK_pinvsupplier PRIMARY KEY (iSupplierId)
    );
END

-- pinvemployee
IF NOT EXISTS (
    SELECT 1 FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = N'dbo' AND t.name = N'pinvemployee'
)
BEGIN
    CREATE TABLE dbo.pinvemployee (
        iEmployeeId INT IDENTITY(1,1) NOT NULL,
        vName VARCHAR(255) NOT NULL,
        vLastName VARCHAR(255) NOT NULL,
        bActive BIT NOT NULL,
        CONSTRAINT PK_pinvemployee PRIMARY KEY (iEmployeeId)
    );
END

-- minvlocationstate
IF NOT EXISTS (
    SELECT 1 FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = N'dbo' AND t.name = N'minvlocationstate'
)
BEGIN
    CREATE TABLE dbo.minvlocationstate (
        iLocationStateId INT IDENTITY(1,1) NOT NULL,
        vName VARCHAR(255) NOT NULL,
        vCode VARCHAR(255) NOT NULL,
        bActive BIT NOT NULL,
        CONSTRAINT PK_minvlocationstate PRIMARY KEY (iLocationStateId)
    );
END

-- minvphysicalstate
IF NOT EXISTS (
    SELECT 1 FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = N'dbo' AND t.name = N'minvphysicalstate'
)
BEGIN
    CREATE TABLE dbo.minvphysicalstate (
        iPhysicalStateId INT IDENTITY(1,1) NOT NULL,
        vName VARCHAR(255) NOT NULL,
        vCode VARCHAR(255) NOT NULL,
        bActive BIT NOT NULL,
        CONSTRAINT PK_minvphysicalstate PRIMARY KEY (iPhysicalStateId)
    );
END

-- minvuser
IF NOT EXISTS (
    SELECT 1 FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = N'dbo' AND t.name = N'minvuser'
)
BEGIN
    CREATE TABLE dbo.minvuser (
        iUserId INT IDENTITY(1,1) NOT NULL,
        vName VARCHAR(255) NOT NULL,
        vPassword VARCHAR(255) NOT NULL,
        bActive BIT NOT NULL,
        CONSTRAINT PK_minvuser PRIMARY KEY (iUserId)
    );
END

-- pinvproduct
IF NOT EXISTS (
    SELECT 1 FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = N'dbo' AND t.name = N'pinvproduct'
)
BEGIN
    CREATE TABLE dbo.pinvproduct (
        iProductId INT IDENTITY(1,1) NOT NULL,
        iModelId INT NOT NULL,
        iBrandId INT NOT NULL,
        iSupplierId BIGINT NOT NULL,
        iCategoryId BIGINT NOT NULL,
        iEmployeeId INT NOT NULL,
        dCostProduct DECIMAL(8,2) NULL,
        vCodeProduct VARCHAR(255) NOT NULL,
        vDescription VARCHAR(255) NOT NULL,
        iLocationStateId INT NOT NULL,
        iPhysicalStateId INT NOT NULL,
        bActive BIT NOT NULL,
        CONSTRAINT PK_pinvproduct PRIMARY KEY (iProductId),
        CONSTRAINT FK_pinvproduct_iemployeeid FOREIGN KEY (iEmployeeId) REFERENCES dbo.pinvemployee(iEmployeeId),
        CONSTRAINT FK_pinvproduct_icategoryid FOREIGN KEY (iCategoryId) REFERENCES dbo.pinvcategory(iCategoryId),
        CONSTRAINT FK_pinvproduct_imodelid FOREIGN KEY (iModelId) REFERENCES dbo.pinvmodel(iModelId),
        CONSTRAINT FK_pinvproduct_iphysicalstateid FOREIGN KEY (iPhysicalStateId) REFERENCES dbo.minvphysicalstate(iPhysicalStateId),
        CONSTRAINT FK_pinvproduct_ilocationstateid FOREIGN KEY (iLocationStateId) REFERENCES dbo.minvlocationstate(iLocationStateId),
        CONSTRAINT FK_pinvproduct_isupplierid FOREIGN KEY (iSupplierId) REFERENCES dbo.pinvsupplier(iSupplierId),
        CONSTRAINT FK_pinvproduct_ibrandid FOREIGN KEY (iBrandId) REFERENCES dbo.pinvbrand(iBrandId),
        CONSTRAINT UQ_pinvproduct_vcodeproduct UNIQUE (vCodeProduct) -- Código de producto único
    );
END

-- pinvmenu
IF NOT EXISTS (
    SELECT 1 FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = N'dbo' AND t.name = N'pinvmenu'
)
BEGIN
    CREATE TABLE dbo.pinvmenu (
        iMenuId INT IDENTITY(1,1) NOT NULL,
        vName VARCHAR(255) NOT NULL,
        iMenuParentId INT,
        vIcon VARCHAR(30) NULL,
        vUrl VARCHAR(200) NULL,
        bActive BIT NOT NULL,
        CONSTRAINT PK_pinvmenu PRIMARY KEY (iMenuId)
    );
END

-- minvrole
IF NOT EXISTS (
    SELECT 1 FROM sys.tables t
    JOIN sys.schemas s ON t.schema_id = s.schema_id
    WHERE s.name = N'dbo' AND t.name = N'minvrole'
)
BEGIN
    CREATE TABLE dbo.minvrole (
        iRoleId INT IDENTITY(1,1) NOT NULL,
        vName VARCHAR(255) NOT NULL,
        vCode VARCHAR(100) NULL,
        bActive BIT NOT NULL,
        CONSTRAINT PK_minvrole PRIMARY KEY (iRoleId)
    );
END

if not exists(
    select 1 from sys.columns where object_id = object_id('pinvmenu') and name = 'vCode'
)
begin
    alter table pinvmenu add vCode varchar(30);
end
go