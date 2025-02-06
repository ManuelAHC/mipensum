using Microsoft.AspNetCore.Mvc;
using MiPensumAPI.Models;
using System.Linq;

[Route("api/[controller]")]
[ApiController]
public class UsuariosController : ControllerBase
{
    private readonly PensumDbContext _context;

    public UsuariosController(PensumDbContext context)
    {
        _context = context;
    }

    // GET: api/Usuarios
    [HttpGet]
    public IActionResult ObtenerUsuarios()
    {
        var usuarios = _context.Usuarios.ToList();
        return Ok(usuarios);
    }

    // GET: api/Usuarios/5
    [HttpGet("{id}")]
    public IActionResult ObtenerUsuario(int id)
    {
        var usuario = _context.Usuarios.Find(id);
        if (usuario == null)
        {
            return NotFound();
        }
        return Ok(usuario);
    }

    // POST: api/Usuarios
    [HttpPost]
    public IActionResult RegistrarUsuario([FromBody] Usuario usuario)
    {
        if (usuario == null)
        {
            return BadRequest();
        }

        _context.Usuarios.Add(usuario);
        _context.SaveChanges();

        return CreatedAtAction(nameof(ObtenerUsuario), new { id = usuario.Id }, usuario);
    }
}
