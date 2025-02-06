using Microsoft.AspNetCore.Mvc;
using MiPensumAPI.Models;
using System.Linq;

[Route("api/[controller]")]
[ApiController]
public class ProgresoController : ControllerBase
{
    private readonly PensumDbContext _context;

    public ProgresoController(PensumDbContext context)
    {
        _context = context;
    }

    // GET: api/Progreso/5
    [HttpGet("{usuarioId}")]
    public IActionResult ObtenerProgreso(int usuarioId)
    {
        var progresos = _context.Progresos
            .Where(p => p.UsuarioId == usuarioId)
            .Select(p => new
            {
                Materia = _context.Materias.FirstOrDefault(m => m.Id == p.MateriaId),
                Completada = p.Completada
            })
            .ToList();

        return Ok(progresos);
    }

    // POST: api/Progreso
    [HttpPost]
    public IActionResult ActualizarProgreso([FromBody] Progreso progreso)
    {
        if (progreso == null)
        {
            return BadRequest();
        }

        // Verificar si la materia existe
        var materia = _context.Materias.FirstOrDefault(m => m.Id == progreso.MateriaId);
        if (materia == null)
        {
            return NotFound("Materia no encontrada");
        }

        // Verificar si el usuario existe
        var usuario = _context.Usuarios.FirstOrDefault(u => u.Id == progreso.UsuarioId);
        if (usuario == null)
        {
            return NotFound("Usuario no encontrado");
        }

        _context.Progresos.Add(progreso);
        _context.SaveChanges();

        return Ok(new { message = "Progreso actualizado exitosamente" });
    }
}
