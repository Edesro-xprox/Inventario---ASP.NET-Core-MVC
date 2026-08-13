# Inventario - ASP.NET Core MVC

Breve descripción
-----------------
Aplicación web para la gestión básica de inventario (panel de control) desarrollada con ASP.NET Core MVC y Razor Views.
Contiene autenticación por cookie/JWT, un menú dinámico y módulos de catálogo (brands, models, categories, suppliers, products,
consumables) que se cargan como vistas parciales e interactúan con JavaScript en `wwwroot/js`.

Requisitos
---------
- .NET 10 SDK instalado
- SQL Server accesible (la cadena de conexión se encuentra en `appsettings.json`)
- (Opcional) Node.js / npm si se utiliza tooling frontend adicional o se instala dependencias en `wwwroot`.

Tecnología / versión
--------------------
- .NET 10
- C# 14
- ASP.NET Core MVC (Razor Views)
- Entity Framework Core (Database context y llamadas a stored procedures)
- JavaScript (módulos ES, jQuery para manipulación DOM y fetch para llamadas HTTP)

Estructura del proyecto (resumen)
--------------------------------
- `Controllers/` : controladores MVC (AccountController, CatalogController, MenuController, ...)
- `Views/` : vistas Razor y vistas parciales (p. ej. `Views/Modules/Catalog/`)
- `wwwroot/js/` : código cliente (módulos por página, providers)
- `Data/` : repositorios y `ApplicationDbContext`
- `Services/` : servicios de negocio que usan los repositorios
- `Models/` : modelos de dominio y entidades
- `DTOs/` : objetos para intercambio entre capas
- `appsettings.json` : configuración (conexiones, JWT)

Cómo ejecutar
-------------
1. Clona el repositorio y abre la carpeta del proyecto:

   ```bash
   git clone <repo-url>
   cd Inventario---ASP.NET-Core-MVC/inventory
   ```

2. Ajusta la cadena de conexión en `appsettings.json` para apuntar a tu instancia de SQL Server:

   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=.;Database=DEV_INVENTORY;Trusted_Connection=True;..."
   }
   ```

3. Restaura y ejecuta la aplicación:

   ```bash
   dotnet restore
   dotnet build
   dotnet run --project inventory
   ```

5. Abre el navegador en `https://localhost:5001` (o la URL que muestre la ejecución).

6. En el SGBD SQL Server crear una base de datos llamada DEV_INVENTORY (u otro nombre de tu preferencia)
y ejecutar los archivos sql de la carpeta scripts en el orden de las fechas puestas en los nombres (el formato es fecha_hora_eespinoza.sql,
ejemplo 20260415_2252_eespinoza.sql).

7. Acceso al sistema (Credenciales)
   - usuario: admin
   - contraseña: 123

Autor
-----
Repositorio original: `Edesro-xprox/Inventario---ASP.NET-Core-MVC` (autor del repo)

Aviso importante sobre `appsettings.json`
-----------------------------------------
En este repositorio se incluye `appsettings.json` con valores de desarrollo (por ejemplo, cadena de conexión y clave JWT).
Esto se ha subido para facilitar la ejecución en desarrollo.
