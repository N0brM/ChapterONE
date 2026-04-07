using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChapterONE.API.Models
{
    public class ProjectCollaborator
    {
        [Key, Column(Order = 0)]
        [ForeignKey("Project")]
        public int ProjectId { get; set; }

        [Key, Column(Order = 1)]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required]
        [RegularExpression("admin|editor|viewer", ErrorMessage = "Cargo Inválido")]
        public string Role { get; set; }

        public Project Project { get; set; }
        public User User { get; set; }
    }
}
