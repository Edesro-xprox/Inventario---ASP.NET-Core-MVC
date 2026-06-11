using inventory.DTOs;
using inventory.Models;
using inventory.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace inventory.Controllers
{
    //[Authorize]
    public class CatalogController : Controller
    {
        private readonly ICatalogService _catalogService;

        public CatalogController(ICatalogService catalogService)
        {
            _catalogService = catalogService;
        }

        [HttpGet]
        public async Task<List<Dictionary<string, object>>> GetCatalog(string code)
        {
            return await _catalogService.GetCatalog(code);
        }

        [HttpPost]
        public async Task<IActionResult> PostCatalog([FromBody] CatalogPutDto dto)
        {
            if (dto == null) return BadRequest();
            var ok = await _catalogService.InsertCatalog(dto.Code, dto.Name, dto.BrandId);
            return Ok(new { status = ok });
        }

        [HttpPut]
        public async Task<IActionResult> PutCatalog([FromBody] CatalogPutDto dto)
        {
            if (dto == null) return BadRequest();
            if (dto.Id == 0) return BadRequest(new { status = false, message = "Id is required for update" });

            var ok = await _catalogService.UpdateCatalog(dto.Code, dto.Id, dto.Name, dto.BrandId);
            return Ok(new { status = ok });
        }

        [HttpPut]
        public async Task<IActionResult> PatchCatalog([FromBody] CatalogActiveDto dto)
        {
            if (dto == null) return BadRequest();
            var ok = await _catalogService.ActiveCatalog(dto.Code, dto.Id, dto.Active);
            return Ok(new { status = ok });
        }

    }
}
