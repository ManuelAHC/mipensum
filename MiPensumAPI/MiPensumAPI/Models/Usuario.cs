﻿namespace MiPensumAPI.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Email { get; set; }
        public List<Progreso> Progresos { get; set; }
    }
}
