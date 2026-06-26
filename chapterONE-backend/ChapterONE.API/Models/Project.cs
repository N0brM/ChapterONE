using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChapterONE.API.Models
{
    public class Project
    {
        [Key]
        public int Id { get; set; }

        [Required, StringLength(200)]
        public string Title { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime CreationDate { get; set; } = DateTime.Now;

        [Required]
        [ForeignKey("Owner")]
        public int OwnerId { get; set; }
        public User? Owner { get; set; }

        [StringLength(7)]
        public string CoverColor { get; set; } = "#6366f1";

        [StringLength(255)]
        public string? CoverImage { get; set; }

        [StringLength(50)]
        public string ProjectType { get; set; } = "Livro";

        // Código único de convite — gerado automaticamente ao criar o projeto
        [StringLength(8)]
        public string InviteCode { get; set; } = GenerateCode();

        public virtual ICollection<Chapter> Chapters { get; set; } = new List<Chapter>();
        public virtual ICollection<ProjectCollaborator> Collaborators { get; set; } = new List<ProjectCollaborator>();

        // Gera um código de 8 caracteres alfanuméricos em maiúsculas
        public static string GenerateCode()
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            var rng = new Random();
            return new string(Enumerable.Range(0, 8)
                .Select(_ => chars[rng.Next(chars.Length)])
                .ToArray());
        }
    }
}
