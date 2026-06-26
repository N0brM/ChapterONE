using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChapterONE.API.Models
{
    [Table("project_references")]
    public class Reference
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [ForeignKey("Project")]
        public int ProjectId { get; set; }
        public Project? Project { get; set; }

        // "character" | "location" | "lore"
        [Required, StringLength(20)]
        public string Type { get; set; } = "character";

        [Required, StringLength(100)]
        public string Name { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
