using Microsoft.EntityFrameworkCore;
using MiPensumAPI.Models;

public class PensumDbContext : DbContext
{
    public PensumDbContext(DbContextOptions<PensumDbContext> options) : base(options) { }

    public DbSet<Materia> Materias { get; set; }
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Progreso> Progresos { get; set; }
}
