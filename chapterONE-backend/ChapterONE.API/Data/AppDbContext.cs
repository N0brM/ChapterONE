using Microsoft.EntityFrameworkCore;
using ChapterONE.API.Models; //demorei 1 hora pa lembrar e adicionar isto :D

namespace ChapterONE.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        //pras tabelas pra depois
        public DbSet<User> Users { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Chapter> Chapters { get; set; }
        public DbSet<ProjectCollaborator> ProjectCollaborators { get; set; }
    }
}
