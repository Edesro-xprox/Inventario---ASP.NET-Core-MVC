if not exists(select 1 from pinvmenu where vName = 'Tipo de equipos')
begin
	insert into pinvmenu(vName, iMenuParentId, vIcon, vUrl, bActive, vCode, iOrder)
	values('Tipo de equipos', 11, 'fa-tags', 'pages/typeEquipment.js', 1, 'typeEquipment', 1)
end
go

if exists(select 1 from pinvmenu where iOrder = 1 and vCode = 'brands')
begin
	update pinvmenu set iOrder = 2 where vCode = 'brands'
	update pinvmenu set iOrder = 3 where vCode = 'models'
	update pinvmenu set iOrder = 4 where vCode = 'categories'
	update pinvmenu set iOrder = 5 where vCode = 'suppliers'
end
go

if not exists(select 1 from sys.tables where name = 'pinvtypeequipment')
begin
	create table pinvtypeequipment(
		iTypeEquipmentId int identity,
		vName varchar(100),
		vPrefix varchar(10),
		bPrefixEdit bit,
		iStockMin int,
		iStockMax int,
		bActive bit

		constraint pk_pinvtypeequipment primary key (iTypeEquipmentId)
	)
end
go

create or alter procedure sps_catalog
	@code varchar(30)
as
begin
	if @code = 'brands' 
		select iBrandId, p.vName [vName], p.bActive 
		from pinvbrand p
	else if @code = 'categories'
		select iCategoryId, vName [vName], bActive from pinvcategory
	else if @code = 'models'
		select m.iModelId [iModelId], m.vName [vName], b.vName [vNameBrand], b.iBrandId [iBrandId], m.bActive 
		from pinvmodel m
		join pinvbrand b on b.iBrandId = m.iBrandId
	else if @code = 'suppliers'
		select iSupplierId, vName [vName], bActive from pinvsupplier
	else if @code = 'typeEquipment'
		select iTypeEquipmentId, vName [vName], vPrefix, isnull(bPrefixEdit,0) bPrefixEdit,
		isnull(iStockMin,0) iStockMin, isnull(iStockMax,0) iStockMax , bActive
		from pinvtypeequipment
end
go

create or alter procedure spi_typeEquipment
	@name varchar(100),
	@prefix varchar(10),
	@editPrefix bit,
	@stockMin int,
	@stockMax int
as
begin
	insert pinvtypeequipment(vName, vPrefix, bPrefixEdit, iStockMin, iStockMax, bActive)
	values(@name, @prefix, @editPrefix, @stockMin, @stockMax, 1)
end
go

create or alter procedure spu_typeEquipment
	@id int,
	@name varchar(100),
	@prefix varchar(10),
	@editPrefix bit,
	@stockMin int,
	@stockMax int
as
begin
	update pinvtypeequipment
	set 
		vName = @name,
		vPrefix = @prefix,
		bPrefixEdit = @editPrefix,
		iStockMin = @stockMin,
		iStockMax = @stockMax
	where iTypeEquipmentId = @id
end
go

create or alter procedure spu_active
	@code varchar(30),
	@ids varchar(max),
	@active bit
as
begin
	if @code = 'brands'
	begin
		update pinvbrand set bActive = @active where iBrandId in (select value from string_split(@ids, ','))
	end
	else if @code = 'models'
	begin
		update pinvmodel set bActive = @active where iModelId in (select value from string_split(@ids, ','))
	end
	else if @code = 'categories'
	begin
		update pinvcategory set bActive = @active where iCategoryId in (select value from string_split(@ids, ','))
	end
	else if @code = 'suppliers'
	begin
		update pinvsupplier set bActive = @active where iSupplierId in (select value from string_split(@ids, ','))
	end
	else if @code = 'typeEquipment'
	begin
		update pinvtypeequipment set bActive = @active where iTypeEquipmentId in (select value from string_split(@ids, ','))
	end
end
go

if exists(select 1 from sys.foreign_keys where name in ('FK_pinvproduct_iphysicalstateid','FK_pinvproduct_ilocationstateid'))
begin
	alter table pinvproduct drop constraint FK_pinvproduct_iphysicalstateid
	alter table pinvproduct drop constraint FK_pinvproduct_ilocationstateid
end
go

if exists(select 1 from sys.tables where name = 'minvlocationstate')
begin
	drop table minvlocationstate
end
go

if exists(select 1 from sys.tables where name = 'minvphysicalstate')
begin
	drop table minvphysicalstate
end
go

if exists(select * from sys.columns where name in ('iLocationStateId','iPhysicalStateId'))
begin
	alter table pinvproduct drop column iLocationStateId
	alter table pinvproduct drop column iPhysicalStateId
end
go

if not exists(select 1 from sys.tables where name = 'minvmodulestate')
begin
	create table minvmodulestate(
		iModuleStateId int identity,
		vName varchar(100),
		vCode varchar(10),
		bActive bit default (1)

		constraint pk_minvmodulestate primary key (iModuleStateId)
	)
end
go

if not exists(select 1 from minvmodulestate)
begin
	insert into minvmodulestate(vName, vCode)
	values('State','STA'),('Situation','SIT')
end
go

if not exists(select 1 from sys.tables where name = 'minvstate')
begin
	create table minvstate(
		iStateId int identity,
		vName varchar(30),
		iModuleStateId int,
		bActive bit default (1)

		constraint pk_minvstate primary key (iStateId)
	)
end
go

if not exists(select 1 from minvstate)
begin
	insert into minvstate(vName, iModuleStateId)
	values
	('Devolución', (select iModuleStateId from minvmodulestate where vCode = 'SIT')),
	('Préstamo', (select iModuleStateId from minvmodulestate where vCode = 'SIT')),
	('Operativo', (select iModuleStateId from minvmodulestate where vCode = 'STA')),
	('De baja', (select iModuleStateId from minvmodulestate where vCode = 'STA')),
	('Malogrado', (select iModuleStateId from minvmodulestate where vCode = 'STA')),
	('Extraviado', (select iModuleStateId from minvmodulestate where vCode = 'STA'))
end
go

if not exists(select 1 from sys.columns where name = 'iStateId' and object_id = '1845581613')
begin
	alter table pinvproduct add iStateId int
	alter table pinvproduct add constraint fk_pinvproduct_minvstate foreign key (iStateId) references minvstate(iStateId)
end
go

if not exists(select 1 from sys.foreign_keys where object_id = '1714105147' and name = 'fk_minvstate_minvmodulestate')
begin
	alter table minvstate add constraint fk_minvstate_minvmodulestate foreign key (iModuleStateId) references minvmodulestate(iModuleStateId)
end
go

if not exists(select 1 from sys.columns where object_id = '1845581613' and name = 'iTypeEquipmentId')
begin
	alter table pinvproduct add iTypeEquipmentId int	
end
go

if not exists(select 1 from sys.foreign_keys where name = 'FK_pinvproduct_pinvtypeequipment')
begin
	alter table pinvproduct add constraint FK_pinvproduct_pinvtypeequipment 
	foreign key (iTypeEquipmentId) references pinvtypeequipment(iTypeEquipmentId)
end
go

create or alter procedure sps_product
as
begin
    set nocount on;

    select p.iProductId [iProductId],
           p.iModelId [iModelId],
           m.vName [vModelName],
           p.iBrandId [iBrandId],
           b.vName [vBrandName],
		   p.iTypeEquipmentId [iTypeEquipmentId],
		   t.vName [vTypeEquipmentName],
           p.iSupplierId [iSupplierId],
           s.vName [vSupplierName],
           p.iCategoryId [iCategoryId],
           c.vName [vCategoryName],
           p.iEmployeeId [iEmployeeId],
           e.vName [vEmployeeName],
           p.dCostProduct [dCostProduct],
           p.vCodeProduct [vCodeProduct],
           p.vDescription [vDescription],
           p.bActive [bActive],
           p.iStateId [iStateProductId],
           st.vName [vStateProduct],
		   p.iStateId [iStateSituationId],
		   st.vName [vStateSituation]
    from pinvproduct p
    left join pinvmodel m on m.iModelId = p.iModelId
    left join pinvbrand b on b.iBrandId = p.iBrandId
    left join pinvsupplier s on s.iSupplierId = p.iSupplierId
    left join pinvcategory c on c.iCategoryId = p.iCategoryId
	left join pinvtypeequipment t on t.iTypeEquipmentId = p.iTypeEquipmentId
    left join pinvemployee e on e.iEmployeeId = p.iEmployeeId
    left join minvstate st on st.iStateId = p.iStateId and st.iModuleStateId in (
		select iModuleStateId from minvmodulestate where vCode = 'STA'
	)
	left join minvstate st2 on st2.iStateId = p.iStateId and st2.iModuleStateId in (
		select iModuleStateId from minvmodulestate where vCode = 'SIT'
	)
    order by p.iProductId;
end
go

create or alter procedure spi_product
    @modelId int,
    @brandId int,
    @supplierId bigint,
    @categoryId bigint,
    @employeeId int,
    @costProduct decimal(8,2) = null,
    @codeProduct varchar(255),
    @description varchar(255),
    @stateId int = null
as
begin
    set nocount on;

    insert into pinvproduct (
        iModelId, iBrandId, iSupplierId, iCategoryId, iEmployeeId,
        dCostProduct, vCodeProduct, vDescription, bActive, iStateId
    )
    values (
        @modelId, @brandId, @supplierId, @categoryId, @employeeId,
        @costProduct, @codeProduct, @description, 1, @stateId
    );
end
go

create or alter procedure spu_product
    @id int,
    @modelId int = null,
    @brandId int = null,
    @supplierId bigint = null,
    @categoryId bigint = null,
    @employeeId int = null,
    @costProduct decimal(8,2) = null,
    @codeProduct varchar(255) = null,
    @description varchar(255) = null,
    @stateId int = null
as
begin
    set nocount on;

    update dbo.pinvproduct
    set iModelId    = @modelId,
        iBrandId    = @brandId,
        iSupplierId = @supplierId,
        iCategoryId = @categoryId,
        iEmployeeId = @employeeId,
        dCostProduct= @costProduct,
        vCodeProduct= @codeProduct,
        vDescription= @description,
        iStateId    = @stateId
    where iProductId = @id;
end
go

create or alter procedure spu_product_active
    @ids varchar(max),
    @active bit
as
begin
    set nocount on;

    update pinvproduct
    set bActive = @active
    where iProductId in (
        select try_cast(value as int) 
        from string_split(@ids, ',')
        where try_cast(value as int) is not null
    );
end
go