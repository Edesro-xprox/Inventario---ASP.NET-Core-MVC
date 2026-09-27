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
    public class ProductController : Controller
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<List<Dictionary<string, object>>> GetProduct()
        {
            return await _productService.GetProducts();
        }

        [HttpPost]
        public async Task<IActionResult> PostProduct([FromBody] ProductUpdateDto dto)
        {
            if (dto == null) return BadRequest();
            var ok = await _productService.InsertProduct(
                dto.ModelId, dto.BrandId, dto.SupplierId,
                dto.Cost, dto.Code, dto.Description, dto.StateId
            );
            return Ok(new { status = ok });
        }

        [HttpPut]
        public async Task<IActionResult> PutProduct([FromBody] ProductUpdateDto dto)
        {
            if (dto == null) return BadRequest();
            if (dto.Id == 0) return BadRequest(new { status = false, message = "Id is required for update" });

            var ok = await _productService.UpdateProduct(
                dto.Id, dto.ModelId, dto.BrandId, dto.SupplierId, 
                dto.Cost, dto.Code, dto.Description, dto.StateId
            );
            return Ok(new { status = ok });
        }

        [HttpPut]
        public async Task<IActionResult> PatchProduct([FromBody] ProductActiveDto dto)
        {
            if (dto == null) return BadRequest();
            var ok = await _productService.ActiveProduct(dto.Ids, dto.Active);
            return Ok(new { status = ok });
        }
    }
}
