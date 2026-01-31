import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as readline from 'readline';
import {
  ClaudeCodeStats,
  ClaudeCodeDashboardMetrics,
  ClaudeCodeModelUsage,
  ClaudeCodeDailyActivity
} from '@ai-monitoring/shared';

interface SessionUsage {
  inputTokens: number;
  outputTokens: number;
  cacheCreationTokens: number;
  cacheReadTokens: number;
  messageCount: number;
}

export class ClaudeCodeService {
  private static statsFilePath: string | null = null;

  /**
   * Find the Claude Code stats file path
   * Handles Windows, macOS, and Linux paths
   */
  static getStatsFilePath(): string {
    if (this.statsFilePath) {
      return this.statsFilePath;
    }

    const homeDir = os.homedir();
    const statsPath = path.join(homeDir, '.claude', 'stats-cache.json');

    this.statsFilePath = statsPath;
    return statsPath;
  }

  /**
   * Check if the Claude Code stats file exists
   */
  static statsFileExists(): boolean {
    try {
      const filePath = this.getStatsFilePath();
      return fs.existsSync(filePath);
    } catch (error) {
      console.error('Error checking stats file existence:', error);
      return false;
    }
  }

  /**
   * Read and parse the Claude Code stats file
   */
  static async readStats(): Promise<ClaudeCodeStats | null> {
    try {
      const filePath = this.getStatsFilePath();

      if (!fs.existsSync(filePath)) {
        console.warn(`Claude Code stats file not found at: ${filePath}`);
        return null;
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const stats: ClaudeCodeStats = JSON.parse(fileContent);

      return stats;
    } catch (error) {
      console.error('Error reading Claude Code stats:', error);
      return null;
    }
  }

  /**
   * Get formatted dashboard metrics from Claude Code stats
   */
  static async getDashboardMetrics(): Promise<ClaudeCodeDashboardMetrics | null> {
    const stats = await this.readStats();

    if (!stats) {
      return null;
    }

    // Get live session usage for today
    const liveUsage = await this.getLiveSessionUsage();

    // Calculate total tokens from stats
    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let totalCacheReadTokens = 0;

    const modelBreakdown: ClaudeCodeDashboardMetrics['modelBreakdown'] = [];

    // Process model usage from stats
    Object.entries(stats.modelUsage).forEach(([model, usage]: [string, ClaudeCodeModelUsage]) => {
      totalInputTokens += usage.inputTokens;
      totalOutputTokens += usage.outputTokens;
      totalCacheReadTokens += usage.cacheReadInputTokens;

      modelBreakdown.push({
        model,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        cacheReadTokens: usage.cacheReadInputTokens,
        totalTokens: usage.inputTokens + usage.outputTokens,
      });
    });

    // Get today's activity from stats
    const today = new Date().toISOString().split('T')[0];
    const todayActivity = stats.dailyActivity.find((activity: ClaudeCodeDailyActivity) => activity.date === today);

    return {
      totalSessions: stats.totalSessions,
      totalMessages: stats.totalMessages,
      totalInputTokens,
      totalOutputTokens,
      totalCacheReadTokens,
      // Use live data for today's metrics
      todayMessages: liveUsage.messageCount || todayActivity?.messageCount || 0,
      todayToolCalls: todayActivity?.toolCallCount || 0,
      todayInputTokens: liveUsage.inputTokens,
      todayOutputTokens: liveUsage.outputTokens,
      todayCacheReadTokens: liveUsage.cacheReadTokens,
      todayCacheCreationTokens: liveUsage.cacheCreationTokens,
      modelBreakdown: modelBreakdown.sort((a: { totalTokens: number }, b: { totalTokens: number }) => b.totalTokens - a.totalTokens),
    };
  }

  /**
   * Get daily activity data
   * @param days Number of days to retrieve (default: 7)
   */
  static async getDailyActivity(days: number = 7): Promise<ClaudeCodeStats['dailyActivity']> {
    const stats = await this.readStats();

    if (!stats) {
      return [];
    }

    // Get the last N days of activity
    const sortedActivity = [...stats.dailyActivity]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, days)
      .reverse();

    return sortedActivity;
  }

  /**
   * Get daily model token usage
   * @param days Number of days to retrieve (default: 7)
   */
  static async getDailyModelTokens(days: number = 7): Promise<ClaudeCodeStats['dailyModelTokens']> {
    const stats = await this.readStats();

    if (!stats) {
      return [];
    }

    // Get the last N days of model tokens
    const sortedTokens = [...stats.dailyModelTokens]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, days)
      .reverse();

    return sortedTokens;
  }

  /**
   * Watch the stats file for changes (for live updates)
   * Returns a function to stop watching
   */
  static watchStatsFile(callback: (stats: ClaudeCodeStats | null) => void): () => void {
    const filePath = this.getStatsFilePath();

    if (!fs.existsSync(filePath)) {
      console.warn(`Cannot watch non-existent file: ${filePath}`);
      return () => {};
    }

    const watcher = fs.watch(filePath, async (eventType) => {
      if (eventType === 'change') {
        const stats = await this.readStats();
        callback(stats);
      }
    });

    return () => {
      watcher.close();
    };
  }

  /**
   * Get live session token usage from active session files
   */
  static async getLiveSessionUsage(): Promise<SessionUsage> {
    const homeDir = os.homedir();
    const projectsDir = path.join(homeDir, '.claude', 'projects');

    const usage: SessionUsage = {
      inputTokens: 0,
      outputTokens: 0,
      cacheCreationTokens: 0,
      cacheReadTokens: 0,
      messageCount: 0,
    };

    try {
      if (!fs.existsSync(projectsDir)) {
        return usage;
      }

      // Get all project folders
      const projects = fs.readdirSync(projectsDir);

      for (const project of projects) {
        const projectPath = path.join(projectsDir, project);
        const stat = fs.statSync(projectPath);

        if (!stat.isDirectory()) continue;

        // Find all .jsonl session files
        const files = fs.readdirSync(projectPath);
        const sessionFiles = files.filter(f => f.endsWith('.jsonl'));

        for (const sessionFile of sessionFiles) {
          const filePath = path.join(projectPath, sessionFile);
          const fileStat = fs.statSync(filePath);

          // Only process files modified today
          const today = new Date().toISOString().split('T')[0];
          const fileDate = fileStat.mtime.toISOString().split('T')[0];

          if (fileDate === today) {
            const sessionUsage = await this.parseSessionFile(filePath);
            usage.inputTokens += sessionUsage.inputTokens;
            usage.outputTokens += sessionUsage.outputTokens;
            usage.cacheCreationTokens += sessionUsage.cacheCreationTokens;
            usage.cacheReadTokens += sessionUsage.cacheReadTokens;
            usage.messageCount += sessionUsage.messageCount;
          }
        }
      }
    } catch (error) {
      console.error('Error reading live session usage:', error);
    }

    return usage;
  }

  /**
   * Parse a session JSONL file for token usage
   */
  static async parseSessionFile(filePath: string): Promise<SessionUsage> {
    const usage: SessionUsage = {
      inputTokens: 0,
      outputTokens: 0,
      cacheCreationTokens: 0,
      cacheReadTokens: 0,
      messageCount: 0,
    };

    try {
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
      });

      const seenMessages = new Set<string>();

      for await (const line of rl) {
        try {
          const entry = JSON.parse(line);

          // Look for assistant messages with usage data
          if (entry.type === 'assistant' && entry.message?.usage) {
            // Deduplicate by requestId to avoid counting streaming chunks multiple times
            const requestId = entry.requestId;
            if (requestId && !seenMessages.has(requestId)) {
              seenMessages.add(requestId);

              const msgUsage = entry.message.usage;
              usage.inputTokens += msgUsage.input_tokens || 0;
              usage.outputTokens += msgUsage.output_tokens || 0;
              usage.cacheCreationTokens += msgUsage.cache_creation_input_tokens || 0;
              usage.cacheReadTokens += msgUsage.cache_read_input_tokens || 0;
              usage.messageCount += 1;
            }
          }
        } catch {
          // Skip invalid JSON lines
        }
      }
    } catch (error) {
      console.error(`Error parsing session file ${filePath}:`, error);
    }

    return usage;
  }

  /**
   * Get file stats (for debugging)
   */
  static async getFileInfo(): Promise<{ exists: boolean; path: string; size?: number; lastModified?: string; lastComputedDate?: string }> {
    const filePath = this.getStatsFilePath();
    const exists = fs.existsSync(filePath);

    if (!exists) {
      return { exists: false, path: filePath };
    }

    const fileStats = fs.statSync(filePath);
    const stats = await this.readStats();

    return {
      exists: true,
      path: filePath,
      size: fileStats.size,
      lastModified: fileStats.mtime.toISOString(),
      lastComputedDate: stats?.lastComputedDate || undefined,
    };
  }
}
