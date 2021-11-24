import Log, { Logger, LogLevel } from "@rbxts/log";
import { ILogEventSink, LogEvent } from "@rbxts/log/out/Core";
import { MessageTemplateParser, PlainTextMessageTemplateRenderer } from "@rbxts/message-templates";
import { GAME_VERSION } from "shared/definitions/game";
import { GameFlags } from "shared/flags";

class LogEventSFTOutputSink implements ILogEventSink {
  public constructor() {}

  public Emit(message: LogEvent) {
    const template = new PlainTextMessageTemplateRenderer(MessageTemplateParser.GetTokens(message.Template));
    const context = message.SourceContext ?? "Game";
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
        tag = "FTL";
        break;
    }

    const message_result = template.Render(message);
    const formatted_message = `[${tag}] ${context} - ${message_result}`;

    if (message.Level >= LogLevel.Warning) {
      warn(formatted_message);
    } else {
      print(formatted_message);
    }
  }
}

/** Setups Vorlias's `@rbxts/log` module both server and client */
export function setupLogger() {
  Log.SetLogger(
    Logger.configure()
      .EnrichWithProperty("VERSION", GAME_VERSION)
      .SetMinLogLevel(
        // prettier-ignore
        GameFlags.NodeEnvironment !== "production"
					? GameFlags.DevMinLogLevel
					: GameFlags.ProdMinLogLevel,
      )
      .WriteTo(new LogEventSFTOutputSink())
      .Create(),
  );
}
