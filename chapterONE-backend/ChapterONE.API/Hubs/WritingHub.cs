using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace ChapterONE.API.Hubs
{
    public class WritingHub : Hub
    {
        private static readonly ConcurrentDictionary<string, CollabUser> _users = new();

        private static readonly string[] Colors =
        {
            "#6366f1", "#ec4899", "#10b981", "#f59e0b",
            "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4"
        };

        // Utilizador entra num capítulo
        public async Task JoinChapter(int chapterId, int userId, string username)
        {
            var group = GroupName(chapterId);
            await Groups.AddToGroupAsync(Context.ConnectionId, group);

            var user = new CollabUser
            {
                ConnectionId = Context.ConnectionId,
                ChapterId = chapterId,
                UserId = userId,
                Username = username,
                Color = Colors[Math.Abs(userId) % Colors.Length],
            };
            _users[Context.ConnectionId] = user;

            await Clients.OthersInGroup(group).SendAsync("UserJoined", new
            {
                user.UserId,
                user.Username,
                user.Color,
            });

            var others = _users.Values
                .Where(u => u.ChapterId == chapterId && u.ConnectionId != Context.ConnectionId)
                .Select(u => new { u.UserId, u.Username, u.Color });

            await Clients.Caller.SendAsync("ActiveUsers", others);
        }

        // gajo saiu
        public async Task LeaveChapter(int chapterId)
        {
            await RemoveUser(Context.ConnectionId, chapterId);
        }

        // Propaga texto a todos os outros no capítulo
        public async Task SendTextUpdate(int chapterId, string content, int userId)
        {
            await Clients
                .OthersInGroup(GroupName(chapterId))
                .SendAsync("ReceiveTextUpdate", content, userId);
        }

        public async Task SendTypingIndicator(int chapterId, int userId, string username, string color)
        {
            await Clients
                .OthersInGroup(GroupName(chapterId))
                .SendAsync("UserTyping", userId, username, color);
        }

        // Desconexão inesperada
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (_users.TryGetValue(Context.ConnectionId, out var user))
                await RemoveUser(Context.ConnectionId, user.ChapterId);

            await base.OnDisconnectedAsync(exception);
        }

        private async Task RemoveUser(string connectionId, int chapterId)
        {
            await Groups.RemoveFromGroupAsync(connectionId, GroupName(chapterId));

            if (_users.TryRemove(connectionId, out var user))
            {
                await Clients
                    .OthersInGroup(GroupName(chapterId))
                    .SendAsync("UserLeft", new { user.UserId, user.Username });
            }
        }

        private static string GroupName(int chapterId) => $"chapter-{chapterId}";
    }

    public class CollabUser
    {
        public string ConnectionId { get; set; } = "";
        public int ChapterId { get; set; }
        public int UserId { get; set; }
        public string Username { get; set; } = "";
        public string Color { get; set; } = "#6366f1";
    }
}
