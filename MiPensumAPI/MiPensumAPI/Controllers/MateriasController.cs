using Microsoft.AspNetCore.Mvc;
using MiPensumAPI.Models;
using System.Linq;

[Route("api/[controller]")]
[ApiController]
public class MateriasController : ControllerBase
{
    private readonly PensumDbContext _context;

    public MateriasController(PensumDbContext context)
    {
        _context = context;
    }

    // GET: api/Materias
    [HttpGet]
    public IActionResult ObtenerMaterias()
    {
        var materias = _context.Materias.ToList();
        return Ok(materias);
    }

    // GET: api/Materias/5
    [HttpGet("{id}")]
    public IActionResult ObtenerMateria(int id)
    {
        var materia = _context.Materias.Find(id);
        if (materia == null)
        {
            return NotFound();
        }
        return Ok(materia);
    }

    // POST: api/Materias
    [HttpPost]
    public IActionResult AgregarMateria([FromBody] Materia materia)
    {
        if (materia == null)
        {
            return BadRequest();
        }

        _context.Materias.Add(materia);
        _context.SaveChanges();

        return CreatedAtAction(nameof(ObtenerMateria), new { id = materia.Id }, materia);
    }
}
