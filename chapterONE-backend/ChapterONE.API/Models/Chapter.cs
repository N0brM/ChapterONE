using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChapterONE.API.Models
{
    public class Chapter
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [ForeignKey("Project")]
        public int ProjectId { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int Order { get; set; }
                      
        public string? Content { get; set; }
        public Project? Project { get; set; }

        // stuff pra AI
        public int WordCount { get; set; } = 0;
        public int ReadingTime { get; set; } = 0;
        [StringLength(50)]
        public string? PredominantEmotion { get; set; }
        public DateTime? LastAnalysisDate { get; set; }
    }
}
