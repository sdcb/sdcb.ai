using System.Diagnostics;
using System.Numerics;
using System.Runtime.InteropServices;
using System.Runtime.InteropServices.JavaScript;
using System.Runtime.Intrinsics.Wasm;
using System.Runtime.Versioning;
using System.Text;
using System.Text.Json;
using Sdcb.SimdGcdrNet;
using Sdcb.SimdGcdrNet.Models;

Console.WriteLine("SimdGcdrNet (browser-wasm) ready");

// With WasmEnableThreads the runtime's managed entry point lives on a deputy thread, so
// synchronous exports cannot be called from the UI thread — every export returns a Task
// and the (blocking) work itself is fine on the deputy thread.
[SupportedOSPlatform("browser")]
public static partial class GcdrApi
{
    private static GcdrEnhancer? _enh;
    private static GCHandle _resultPin;

    [JSExport]
    public static Task<string> Init()
    {
        Stopwatch sw = Stopwatch.StartNew();
        // Browser has no GPU: Vulkan/Metal P/Invokes don't exist, Auto resolves to CPU.
        _enh ??= GcdrEnhancer.FromBytes(GcdrModels.GcNet, GcdrModels.DrNet, GcdrBackend.Cpu);
        return Task.FromResult(Json(w =>
        {
            w.WriteNumber("loadMs", sw.Elapsed.TotalMilliseconds);
            w.WriteString("runtime", RuntimeInformation.FrameworkDescription);
            w.WriteBoolean("simd", PackedSimd.IsSupported);
            w.WriteNumber("vectorBits", Vector<byte>.Count * 8);
            w.WriteNumber("threads", Threads());
        }));
    }

    // Returns {"ms", "ptr", "len"}: the enhanced RGBA frame is kept pinned until the next
    // call; JS copies it out of the wasm heap via runtime.localHeapViewU8().
    [JSExport]
    public static Task<string> Enhance(byte[] rgba, int width, int height)
    {
        if (_enh is null) throw new InvalidOperationException("Call Init() first.");
        Stopwatch sw = Stopwatch.StartNew();
        byte[] dst = _enh.Enhance(rgba, width, height, GcdrPixelFormat.Rgba32);
        double ms = sw.Elapsed.TotalMilliseconds;
        if (_resultPin.IsAllocated) _resultPin.Free();
        _resultPin = GCHandle.Alloc(dst, GCHandleType.Pinned);
        return Task.FromResult(Json(w =>
        {
            w.WriteNumber("ms", ms);
            w.WriteNumber("ptr", _resultPin.AddrOfPinnedObject().ToInt64());
            w.WriteNumber("len", dst.Length);
        }));
    }

    private static int Threads()
    {
        string? s = Environment.GetEnvironmentVariable("GCDRNET_THREADS");
        return int.TryParse(s, out int t) && t > 0 ? t : Environment.ProcessorCount;
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
