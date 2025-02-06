namespace MiPensumAPI.Models
{
    public class Progreso
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public string CodigoMateria { get; set; }
        public bool Completada { get; set; }
        public Usuario Usuario { get; set; }
        public int MateriaId { get; set; }
    }
}
