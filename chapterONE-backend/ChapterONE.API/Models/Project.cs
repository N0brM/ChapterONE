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

        // "Livro", "Serie", "Filme" — padrão é Livro
        [StringLength(50)]
        public string? ProjectType { get; set; } = "Livro";

        public virtual ICollection<Chapter> Chapters { get; set; } = new List<Chapter>();
        public virtual ICollection<ProjectCollaborator> Collaborators { get; set; } = new List<ProjectCollaborator>();
    }
}
