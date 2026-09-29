using System.Diagnostics;
using System.Numerics;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Intrinsics;
using System.Runtime.Versioning;
using System.Text;
using System.Text.Json;
using Sdcb.SimdPaddleOCR;
using Sdcb.SimdPaddleOCR.Models.ChineseV6Tiny;

Console.WriteLine("SimdPaddleOCR (browser-wasm) ready");

[SupportedOSPlatform("browser")]
public static partial class OcrApi
{
    private static PaddleOcrAll? _ocr;

    [JSExport]
    public static async Task<string> Init()
    {
        Stopwatch sw = Stopwatch.StartNew();
        // browser-wasm is single-threaded: one line worker, no intra-op fan-out.
        _ocr ??= await PaddleOcrAll.LoadAsync(ChineseV6TinyModels.Default, new PaddleOcrOptions
        {
            LineWorkerCount = 1,
            DetIntraOpThreads = 1,
        });
        return Json(w =>
        {
            w.WriteNumber("loadMs", sw.Elapsed.TotalMilliseconds);
            w.WriteString("runtime", System.Runtime.InteropServices.RuntimeInformation.FrameworkDescription);
            w.WriteBoolean("simd", Vector128.IsHardwareAccelerated);
            w.WriteNumber("vectorBits", Vector<byte>.Count * 8);
        });
    }

    [JSExport]
    public static string Run(byte[] rgba, int width, int height)
    {
        if (_ocr is null) throw new InvalidOperationException("Call Init() first.");
        Stopwatch sw = Stopwatch.StartNew();
        PaddleOcrResult result = _ocr.Run(rgba, width, height, format: ImagePixelFormat.Rgba32);
        double ms = sw.Elapsed.TotalMilliseconds;
        return Json(w =>
        {
            w.WriteNumber("ms", ms);
            w.WriteNumber("detected", result.DetectedCount);
            w.WriteStartArray("lines");
            foreach (PaddleOcrLine line in result.Lines)
            {
                w.WriteStartObject();
                w.WriteString("text", line.Text);
                w.WriteNumber("score", line.RecognitionScore);
                w.WriteNumber("rotation", line.AppliedRotationDegrees);
                w.WriteStartArray("box");
                PaddleOcrDetectionBox b = line.Box;
                for (int i = 0; i < 4; i++)
                {
                    w.WriteNumberValue(b[i].X);
                    w.WriteNumberValue(b[i].Y);
                }
                w.WriteEndArray();
                w.WriteEndObject();
            }
            w.WriteEndArray();
        });
    }

    private static string Json(Action<Utf8JsonWriter> body)
    {
        using MemoryStream ms = new();
        using (Utf8JsonWriter w = new(ms))
        {
            w.WriteStartObject();
            body(w);
            w.WriteEndObject();
        }
        return Encoding.UTF8.GetString(ms.ToArray());
    }
}
