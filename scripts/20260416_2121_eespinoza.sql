if not exists(select 1 from minvuser)
begin
	insert into minvuser(vName, vPassword, bActive)
	values('admin','AQAAAAIAAYagAAAAED1mVRiJcQTN3AqUBlei9XKdJQL/DDp3oOrWGQVJ2tmdrV7Hs9GdqQFjD2rLmMUT3Q==',1)
end
go

if not exists(select 1 from pinvmenu)
begin
	insert into pinvmenu(vName, iMenuParentId, vIcon, vUrl, bActive)
	values('Dashboard',null,'fa-tachometer','pages/dashboard.js',1),
		  ('Inventario',null,'fa-boxes','pages/inventory.js',1),
		  ('Empleados',null,'','',0),
		  ('Catálogo',null,'fa-warehouse','',1),
		  ('Productos',null,'fa-cubes','pages/products.js',1),
		  ('Consumibles',null,'','',0),
		  ('Configuración',null,'fa-cog','pages/configuration.js',1)
end
go

if not exists(select 1 from pinvmenu where iMenuParentId = (
	select iMenuId from pinvmenu where vName = 'Catálogo'
	)
)
begin
	declare @id int = (select iMenuId from pinvmenu where vName = 'Catálogo')
	insert into pinvmenu(vName, iMenuParentId, vIcon, vUrl, bActive)
	values('Marcas',@id,'fa-tag','pages/brands.js',1),
		  ('Modelos',@id,'fa-tags','pages/models.js',1),
		  ('Categorías',@id,'fa-list','pages/categories.js',1),
		  ('Proveedores',@id,'fa-list','pages/suppliers.js',1)
end
go

if not exists(select 1 from minvrole)
begin
	insert into minvrole(vName, vCode, bActive)
	values('Administrador','ADMIN',1),
		  ('Usuario','USER',1)	
end
go

if not exists(select 1 from pinvmenu where vCode is not null)
begin
	update pinvmenu set vCode = 'dashboard' where vName = 'Dashboard'
	update pinvmenu set vCode = 'inventory' where vName = 'Inventario'
	update pinvmenu set vCode = 'employees' where vName = 'Empleados'
	update pinvmenu set vCode = 'catalog' where vName = 'Catálogo'
	update pinvmenu set vCode = 'products' where vName = 'Productos'
	update pinvmenu set vCode = 'consumables' where vName = 'Consumibles'
	update pinvmenu set vCode = 'configuration' where vName = 'Configuración'
	update pinvmenu set vCode = 'brands' where vName = 'Marcas'
	update pinvmenu set vCode = 'models' where vName = 'Modelos'
	update pinvmenu set vCode = 'categories' where vName = 'Categorías'
	update pinvmenu set vCode = 'suppliers' where vName = 'Proveedores'
end
go

IF NOT EXISTS (SELECT 1 FROM pinvbrand)
BEGIN
    INSERT INTO pinvbrand
    (
        vName,
        bActive
    )
    VALUES
    ('Apple', 1),
    ('Samsung', 1),
    ('Sony', 1),
    ('Asus', 1),
    ('Nintendo', 1),
    ('Apple', 1),
    ('Lenovo', 1),
    ('GoPro', 1),
    ('PlayStation', 1),
    ('Amazon', 1)
END
GO

IF NOT EXISTS (SELECT 1 FROM pinvmodel)
BEGIN
    INSERT INTO pinvmodel
    (
		iBrandId,
        vName,
        bActive
    )
    VALUES
    (1,'Apple MacBook Air M3', 1),
    (2,'Samsung Galaxy S26 Ultra', 1),
    (3,'Sony WH-1000XM5', 1),
    (4,'Asus ROG Strix G16', 1),
    (5,'Nintendo Switch OLED', 1),
    (6,'iPad Pro M4', 1),
    (7,'Lenovo ThinkPad X1 Carbon', 1),
    (8,'GoPro HERO12 Black', 1),
    (9,'PlayStation 5 Pro', 1),
    (10,'Amazon Echo Dot 5', 1)
END
GO

IF NOT EXISTS (SELECT 1 FROM pinvcategory)
BEGIN
    INSERT INTO pinvcategory
    (
        vName,
        bActive
    )
    VALUES
    ('Laptops', 1),
    ('Computadoras de Escritorio', 1),
    ('Monitores', 1),
    ('Impresoras', 1),
    ('Tablets', 1),
    ('Smartphones', 1),
    ('Accesorios de Computación', 1),
    ('Periféricos', 1),
    ('Consolas de Videojuegos', 1),
    ('Audio y Sonido', 1),
    ('Cámaras y Fotografía', 1),
    ('Redes y Comunicaciones', 1),
    ('Almacenamiento', 1),
    ('Componentes de PC', 1),
    ('Software', 1),
    ('Mobiliario de Oficina', 1),
    ('Útiles de Oficina', 1),
    ('Equipos de Seguridad', 1),
    ('Herramientas', 1),
    ('Otros', 1)
END
GO

IF NOT EXISTS (SELECT 1 FROM pinvsupplier)
BEGIN
    INSERT INTO pinvsupplier
    (
        vName,
        bActive
    )
    VALUES
    ('Tech Distribuciones S.A.C.', 1),
    ('Importadora Digital Perú', 1),
    ('Global Technology Supply', 1),
    ('Comercializadora Andina', 1),
    ('Mayorista de Equipos Informáticos', 1),
    ('Soluciones Empresariales Integrales', 1),
    ('Distribuidora Nacional de Tecnología', 1),
    ('Suministros y Servicios Corporativos', 1),
    ('Proveedores Industriales del Perú', 1),
    ('Innovación Tecnológica S.A.', 1),
    ('Redes y Comunicaciones Globales', 1),
    ('Almacenes Tecnológicos Unidos', 1),
    ('Equipamiento Profesional S.A.C.', 1),
    ('Importaciones Corporativas del Sur', 1),
    ('Servicios y Suministros Generales', 1)
END
GO

--if exists(select 1 from pinvmenu where vCode = 'products')
--begin
--    update pinvmenu set vName = 'Reportes' where vCode = 'products'
--    update pinvmenu set vUrl = 'pages/reports.js', vCode = 'reports' where vName = 'Reportes'
--end
--go

if not exists(select 1 from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME = 'pinvmenu' and COLUMN_NAME = 'iOrder')
begin
    alter table pinvmenu add iOrder int
end
go

if not exists(select 1 from pinvmenu where iOrder is not null)
begin
    update pinvmenu set iOrder = 1 where vCode = 'dashboard'
    update pinvmenu set iOrder = 2 where vCode = 'inventory'
    update pinvmenu set iOrder = 3 where vCode = 'products'
    update pinvmenu set iOrder = 4 where vCode = 'consumables'
    update pinvmenu set iOrder = 5 where vCode = 'catalog'
    update pinvmenu set iOrder = 6 where vCode = 'employees'
    update pinvmenu set iOrder = 7 where vCode = 'configuration'
    update pinvmenu set iOrder = 1 where vCode = 'brands'
    update pinvmenu set iOrder = 2 where vCode = 'models'
    update pinvmenu set iOrder = 3 where vCode = 'categories'
    update pinvmenu set iOrder = 4 where vCode = 'suppliers'
end
go

update pinvmenu set bActive = 0 where vCode = 'inventory'
update pinvmenu set vUrl = 'pages/consumables.js', vIcon = 'fa-box-open', bActive = 1 where vCode = 'consumables'
go