create or alter procedure sps_menus
as
begin
	select iMenuId, vName, isnull(iMenuParentId,0) iMenuParentId, vIcon, vUrl, bActive, iOrder
	from pinvmenu
	where bActive = 1
end
go

create or alter procedure sps_catalog
	@code varchar(30)
as
begin
	if @code = 'brands' 
		select iBrandId, p.vName [vNameBrand], p.bActive 
		from pinvbrand p
	else if @code = 'categories'
		select iCategoryId, vName [vNameCategory], bActive from pinvcategory
	else if @code = 'models'
		select m.iModelId [iModelId], m.vName [vNameModel], b.vName [vNameBrand], b.iBrandId [iBrandId], m.bActive 
		from pinvmodel m
		join pinvbrand b on b.iBrandId = m.iBrandId
	else if @code = 'suppliers'
		select iSupplierId, vName [vNameSupplier], bActive from pinvsupplier
end
go

create or alter procedure spi_catalog
	@code varchar(30),
	@name varchar(max),
	@brandId int
as
begin
	if @code = 'brands'
	begin
		insert into pinvbrand (vName, bActive) values (@name, 1)
	end
	else if @code = 'models'
	begin
		insert into pinvmodel (iBrandId, vName, bActive) values (@brandId, @name, 1)
	end
	else if @code = 'categories'
	begin
		insert into pinvcategory (vName, bActive) values (@name, 1)
	end
	else if @code = 'suppliers'
	begin
		insert into pinvsupplier (vName, bActive) values (@name, 1)
	end
end
go

create or alter procedure spu_catalog
	@code varchar(30),
	@id int,
	@name varchar(max),
	@brandId int
as
begin
	if @code = 'brands'
	begin
		update pinvbrand set vName = @name where iBrandId = @id
	end
	else if @code = 'models'
	begin
		update pinvmodel set vName = @name, iBrandId = @brandId where iModelId = @id
	end
	else if @code = 'categories'
	begin
		update pinvcategory set vName = @name where iCategoryId = @id
	end
	else if @code = 'suppliers'
	begin
		update pinvsupplier set vName = @name where iSupplierId = @id
	end
end
go

create or alter procedure spu_active
	@code varchar(30),
	@id int,
	@active bit
as
begin
	if @code = 'brands'
	begin
		update pinvbrand set bActive = @active where iBrandId = @id
	end
	else if @code = 'models'
	begin
		update pinvmodel set bActive = @active where iModelId = @id
	end
	else if @code = 'categories'
	begin
		update pinvcategory set bActive = @active where iCategoryId = @id
	end
	else if @code = 'suppliers'
	begin
		update pinvsupplier set bActive = @active where iSupplierId = @id
	end
end
go