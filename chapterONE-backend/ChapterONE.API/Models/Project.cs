using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChapterONE.API.Models
{
    public class Project
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public DateTime CreationDate { get; set; } = DateTime.Now;

        [Required]
        [ForeignKey("Owner")]
        public int OwnerId { get; set; }
        
        public User? Owner { get; set; }

        public ICollection<Chapter> Chapters { get; set; }
        public ICollection<ProjectCollaborator> Collaborators { get; set; }

    }
}
