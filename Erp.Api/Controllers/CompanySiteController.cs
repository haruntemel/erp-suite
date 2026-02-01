using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Erp.Api.Models;
using Erp.Api.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Erp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CompanySitesController : ControllerBase
    {
        private readonly ErpDbContext _context;

        public CompanySitesController(ErpDbContext context)
        {
            _context = context;
        }

        // GET: api/CompanySites
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CompanySite>>> GetCompanySites()
        {
            return await _context.CompanySites.ToListAsync();
        }

        // GET: api/CompanySites/{company}/{contract}
        [HttpGet("{company}/{contract}")]
        public async Task<ActionResult<CompanySite>> GetCompanySite(string company, string contract)
        {
            var companySite = await _context.CompanySites
                .FirstOrDefaultAsync(cs => cs.Company == company && cs.Contract == contract);

            if (companySite == null)
            {
                return NotFound();
            }

            return companySite;
        }

        // POST: api/CompanySites
        [HttpPost]
        public async Task<ActionResult<CompanySite>> PostCompanySite(CompanySite companySite)
        {
            _context.CompanySites.Add(companySite);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CompanySiteExists(companySite.Company, companySite.Contract))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction(nameof(GetCompanySite), 
                new { company = companySite.Company, contract = companySite.Contract }, 
                companySite);
        }

        // PUT: api/CompanySites/{company}/{contract}
        [HttpPut("{company}/{contract}")]
        public async Task<IActionResult> PutCompanySite(string company, string contract, CompanySite companySite)
        {
            if (company != companySite.Company || contract != companySite.Contract)
            {
                return BadRequest();
            }

            _context.Entry(companySite).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CompanySiteExists(company, contract))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/CompanySites/{company}/{contract}
        [HttpDelete("{company}/{contract}")]
        public async Task<IActionResult> DeleteCompanySite(string company, string contract)
        {
            var companySite = await _context.CompanySites
                .FirstOrDefaultAsync(cs => cs.Company == company && cs.Contract == contract);
            
            if (companySite == null)
            {
                return NotFound();
            }

            _context.CompanySites.Remove(companySite);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CompanySiteExists(string company, string contract)
        {
            return _context.CompanySites
                .Any(e => e.Company == company && e.Contract == contract);
        }
    }
}