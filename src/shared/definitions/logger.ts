import { Logger, LogLevel } from "@rbxts/log";
import { ILogEventSink, LogEvent } from "@rbxts/log/out/Core";
import { MessageTemplateParser, PlainTextMessageTemplateRenderer } from "@rbxts/message-templates";
import { RunService } from "@rbxts/services";
import { isGameInProduction } from "shared/utils/game";

class SoftwareTycoonSink implements ILogEventSink {
  public Emit(message: LogEvent): void {
    const template = new PlainTextMessageTemplateRenderer(
      MessageTemplateParser.GetTokens(message.Template),
    );
    let tag: string;
    switch (message.Level) {
      case LogLevel.Verbose:
        tag = "VRB";
        break;
      case LogLevel.Debugging:
        tag = "DBG";
        break;
      case LogLevel.Information:
        tag = "INF";
        break;
      case LogLevel.Warning:
        tag = "WRN";
        break;
      case LogLevel.Error:
        tag = "ERR";
        break;
      case LogLevel.Fatal:
        tag = "FLT";
        break;
    }

    const messageRendered = template.Render(message);
    const formattedMessage = `[${tag}: ${message.SourceContext ?? "Game"}] ${messageRendered}`;

    if (message.Level >= LogLevel.Warning) {
      warn(formattedMessage);
    } else {
      print(formattedMessage);
    }
  }
}

/**
 * The default configuration for this game.
 *
 * **It will work both the server and the client**.
 */
export const LogConfig = Logger.configure()
  .EnrichWithProperty("GameName", "Software Tycoon")
  .EnrichWithProperty("GameVersion", "v0.0.1-alpha.6")
  .EnrichWithProperty("SessionEnv", isGameInProduction() ? "debug" : "production")
  .EnrichWithProperty("SessionSide", RunService.IsClient() ? "client" : "server")
  .SetMinLogLevel(isGameInProduction() ? LogLevel.Information : LogLevel.Verbose)
  .WriteTo(new SoftwareTycoonSink());
