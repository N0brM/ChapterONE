
using System.ComponentModel.DataAnnotations;

namespace ChapterONE.API.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; } = DateTime.Now;

        [StringLength(50)]
        public string PreferredTheme { get; set; } = "modern-light";
        [StringLength(255)]
        public string? ProfilePicture { get; set; }

        public ICollection<Project> OwnedProjects { get; set; }
        public virtual ICollection<ProjectCollaborator> Collaborations { get; set; } = new List<ProjectCollaborator>();
    }
}
