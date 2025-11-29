import 'package:flutter/material.dart';
import '../components/background_gradient.dart';
import '../components/xp_painter.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBackground(
      child: Scaffold(
        backgroundColor: Colors.transparent,

        floatingActionButton: Container(
          height: 70,
          width: 70,
          decoration: const BoxDecoration(
            shape: BoxShape.circle,
            gradient: LinearGradient(
              colors: [Color(0xFF4FACFE), Color(0xFF00F2FE)],
            ),
          ),
          child: const Icon(Icons.add, color: Colors.white, size: 36),
        ),

        body: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 10),

                // Top Row - Avatar + Title + Settings
                Row(
                  children: [
                    // Avatar
                    const CircleAvatar(
                      radius: 22,
                      backgroundImage: AssetImage("assets/user.png"),
                    ),
                    const SizedBox(width: 10),

                    // Level Badge
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        "Lvl 12",
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                    ),

                    const Spacer(),

                    const Icon(Icons.settings, size: 26),
                  ],
                ),

                const SizedBox(height: 20),

                const Text(
                  "Good Morning, Alex!",
                  style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800),
                ),

                Text(
                  "Tuesday, October 24",
                  style: TextStyle(
                    color: Colors.black.withOpacity(0.6),
                    fontSize: 16,
                  ),
                ),

                const SizedBox(height: 20),

                // XP + Streak Card
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.6),
                    borderRadius: BorderRadius.circular(28),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Streak
                      Column(
                        children: const [
                          Icon(
                            Icons.local_fire_department,
                            color: Colors.red,
                            size: 40,
                          ),
                          SizedBox(height: 6),
                          Text(
                            "15",
                            style: TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Text("Day Streak!", style: TextStyle(fontSize: 14)),
                        ],
                      ),

                      // XP Ring
                      SizedBox(
                        width: 100,
                        height: 100,
                        child: CustomPaint(
                          painter: XpProgressPainter(1200 / 1500),
                          child: Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: const [
                                Text(
                                  "1200",
                                  style: TextStyle(
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                Text(
                                  "/ 1500 XP",
                                  style: TextStyle(
                                    fontSize: 12,
                                    color: Colors.black54,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),

                      // Rewards
                      Column(
                        children: const [
                          Text(
                            "Daily Rewards",
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          SizedBox(height: 6),
                          Text("🎁  >  🎁", style: TextStyle(fontSize: 22)),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 25),

                // Tabs
                Row(
                  children: [
                    _tab("Today", isActive: true),
                    _tab("Completed"),
                    _tab("Pending"),
                  ],
                ),

                const SizedBox(height: 20),

                // Task Cards
                _taskCard(
                  title: "Morning Stand-up Meeting",
                  subtitle: "Discuss project roadmap...",
                  time: "10:00 AM - 10:30 AM",
                  priority: "High",
                  priorityColor: Colors.blue,
                  xp: 50,
                ),

                _taskCard(
                  title: "Review Design Mockups",
                  subtitle: "For new feature...",
                  time: "11:30 AM",
                  priority: "Medium",
                  priorityColor: Colors.amber,
                  xp: 30,
                ),

                _taskCard(
                  title: "Submit Weekly Report",
                  subtitle: "Due by end of day...",
                  time: "5:00 PM",
                  priority: "Urgent",
                  priorityColor: Colors.red,
                  xp: 70,
                  isOverdue: true,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _tab(String text, {bool isActive = false}) {
    return Padding(
      padding: const EdgeInsets.only(right: 20),
      child: Column(
        children: [
          Text(
            text,
            style: TextStyle(
              fontSize: 16,
              fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
              color: isActive ? Colors.black : Colors.black54,
            ),
          ),
          if (isActive)
            Container(
              margin: const EdgeInsets.only(top: 6),
              height: 8,
              width: 55,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF6A4DFF), Color(0xFF8B65FF)],
                ),
                borderRadius: BorderRadius.circular(20),
              ),
            ),
        ],
      ),
    );
  }

  Widget _taskCard({
    required String title,
    required String subtitle,
    required String time,
    required String priority,
    required Color priorityColor,
    required int xp,
    bool isOverdue = false,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.7),
        borderRadius: BorderRadius.circular(22),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (isOverdue)
            const Text(
              "OVERDUE",
              style: TextStyle(
                color: Colors.red,
                fontWeight: FontWeight.w700,
                fontSize: 13,
              ),
            ),

          Text(
            title,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),

          Text(
            subtitle,
            style: TextStyle(
              color: Colors.black.withOpacity(0.6),
              fontSize: 14,
            ),
          ),

          const SizedBox(height: 12),

          Row(
            children: [
              const Icon(Icons.access_time, size: 18),
              const SizedBox(width: 4),
              Text(
                time,
                style: const TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.w500,
                ),
              ),

              const Spacer(),

              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: priorityColor.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  priority,
                  style: TextStyle(
                    color: priorityColor,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),

              const SizedBox(width: 12),
              const Icon(Icons.diamond, color: Colors.blue, size: 20),
              Text(" $xp XP"),
            ],
          ),
        ],
      ),
    );
  }
}
