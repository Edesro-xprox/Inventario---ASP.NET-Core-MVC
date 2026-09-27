using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using inventory.Models;
using inventory.Services;

namespace inventory.Controllers
{
    public class MenuController : Controller
    {
        private readonly IMenuService _menuService;

        public MenuController(IMenuService menuService)
        {
            _menuService = menuService;
        }

        [HttpGet]
        public async Task<List<Menu>> GetMenus()
        {
            return await _menuService.GetMenus();
        }
        public IActionResult MenuRender(string menu)
        {
            ViewBag.menu = menu;

            return menu switch
            {
                "typeEquipment" or "models" or "brands" or "categories" or "suppliers" => PartialView("~/Views/Modules/Catalog/Catalog.cshtml"),
                "dashboard" => PartialView("~/Views/Modules/Dashboard/Dashboard.cshtml"),
                "configuration" => PartialView("~/Views/Modules/Configuration/Configuration.cshtml"),
                "inventory" => PartialView("~/Views/Modules/Inventory/Inventory.cshtml"),
                "products" => PartialView("~/Views/Modules/Products/Products.cshtml"),
                "consumables" => PartialView("~/Views/Modules/Consumables/Consumables.cshtml"),
                _ => NotFound()
            };
        }

    }
}
