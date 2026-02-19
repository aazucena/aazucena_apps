'use client';

import * as React from 'react';
import { 
  Button, 
  Slider, 
  Separator, 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  Kbd,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@aazucena/ui';
import * as Icons from '@aazucena/icons';
import { useObjectViewer } from './context.js';
import type { PresetsType } from '@react-three/drei/helpers/environment-assets.js';

const ENV_PRESETS = ['city', 'night', 'warehouse', 'forest', 'sunset'] as PresetsType[];

/**
 * ObjectViewerControls - The interactive inspector panel
 */
export function ObjectViewerControls() {
  const {
    showGrid, setShowGrid,
    autoRotate, setAutoRotate,
    wireframe, setWireframe,
    envPreset, setEnvPreset,
    showStats, setShowStats,
    showBBox, setShowBBox,
    showAxes, setShowAxes,
    isSlowMo, setIsSlowMo,
    intensity, setIntensity,
    isCapturing, takeScreenshot,
    isResetting, resetCamera
  } = useObjectViewer();

  return (
    <div className="absolute top-6 right-6 z-20 w-52 transition-all duration-500 opacity-90 hover:opacity-100 scale-95 hover:scale-100 origin-top-right">
      <Card variant="cyber" padding="none" className="overflow-hidden backdrop-blur-xl border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
        <CardHeader className="p-3 border-b border-cyan-500/20 bg-cyan-500/5">
          <CardTitle className="text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icons.Cog size={12} className="animate-spin-slow" />
              Inspector_v1.2
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_cyan]" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2.5 flex flex-col gap-1.5">
          
          {/* Visibility Group */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={showGrid ? 'cyber' : 'ghost'}
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className="justify-between px-2 h-8 w-full border-none shadow-none group/btn"
              >
                <div className="flex items-center">
                  <Icons.Dots size={14} className="group-hover/btn:text-cyan-400" />
                  <span className="text-[9px] font-mono uppercase tracking-widest ml-2">Show_Grid</span>
                </div>
                <Kbd className="text-[8px] opacity-50 bg-black/20">G</Kbd>
              </Button>
            </TooltipTrigger>
            <TooltipContent variant="cyber" side="left">Toggles coordinate floor grid</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={autoRotate ? 'cyber' : 'ghost'}
                size="sm"
                onClick={() => setAutoRotate(!autoRotate)}
                className="justify-between px-2 h-8 w-full border-none shadow-none group/btn"
              >
                <div className="flex items-center">
                  <Icons.Refresh size={14} className={autoRotate ? 'animate-spin-slow text-cyan-400' : 'group-hover/btn:text-cyan-400'} />
                  <span className="text-[9px] font-mono uppercase tracking-widest ml-2">Orbit_Mode</span>
                </div>
                <Kbd className="text-[8px] opacity-50 bg-black/20">R</Kbd>
              </Button>
            </TooltipTrigger>
            <TooltipContent variant="cyber" side="left">Automatic 360° camera rotation</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={wireframe ? 'cyber' : 'ghost'}
                size="sm"
                onClick={() => setWireframe(!wireframe)}
                className="justify-between px-2 h-8 w-full border-none shadow-none group/btn"
              >
                <div className="flex items-center">
                  <Icons.Terminal size={14} className="group-hover/btn:text-cyan-400" />
                  <span className="text-[9px] font-mono uppercase tracking-widest ml-2">Wireframe</span>
                </div>
                <Kbd className="text-[8px] opacity-50 bg-black/20">W</Kbd>
              </Button>
            </TooltipTrigger>
            <TooltipContent variant="cyber" side="left">Toggle geometry wireframe mode</TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className="justify-between px-2 h-8 w-full text-zinc-900 dark:text-zinc-100 hover:text-cyan-400 border-none"
                  >
                    <div className="flex items-center">
                      <Icons.Sun size={14} />
                      <span className="text-[9px] font-mono uppercase tracking-widest ml-2 truncate">Env: {envPreset}</span>
                    </div>
                    <Icons.ChevronDown size={10} className="opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent variant="cyber" side="left">Select HDR lighting environment</TooltipContent>
            </Tooltip>
            <DropdownMenuContent variant="cyber" side="left" align="start" className="w-48">
              <DropdownMenuLabel className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 px-2 py-1.5">Lighting_Presets</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-cyan-500/10" />
              <DropdownMenuRadioGroup value={envPreset} onValueChange={(v) => setEnvPreset(v as PresetsType)}>
                {ENV_PRESETS.map((preset) => (
                  <DropdownMenuRadioItem key={preset} value={preset} className="text-[10px] font-mono uppercase tracking-widest focus:bg-cyan-500/10 focus:text-cyan-400 py-2">
                    {preset}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator variant="cyber" thickness="thin" className="my-1 opacity-20" />

          {/* Performance Group */}
          <Button 
            variant={showStats ? 'cyber' : 'ghost'}
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="justify-start px-2 h-8 w-full border-none shadow-none"
          >
            <Icons.Activity size={14} />
            <span className="text-[9px] font-mono uppercase tracking-widest ml-2">Performance</span>
          </Button>

          <Button 
            variant={showBBox ? 'cyber' : 'ghost'}
            size="sm"
            onClick={() => setShowBBox(!showBBox)}
            className="justify-start px-2 h-8 w-full border-none shadow-none"
          >
            <Icons.Shield size={14} />
            <span className="text-[9px] font-mono uppercase tracking-widest ml-2">Hitbox_View</span>
          </Button>

          <Button 
            variant={showAxes ? 'cyber' : 'ghost'}
            size="sm"
            onClick={() => setShowAxes(!showAxes)}
            className="justify-start px-2 h-8 w-full border-none shadow-none"
          >
            <Icons.Zap size={14} />
            <span className="text-[9px] font-mono uppercase tracking-widest ml-2">Origin_Axes</span>
          </Button>

          <Button 
            variant={isSlowMo ? 'cyber' : 'ghost'}
            size="sm"
            onClick={() => setIsSlowMo(!isSlowMo)}
            className="justify-start px-2 h-8 w-full border-none shadow-none"
          >
            <Icons.ClockCircle size={14} />
            <span className="text-[9px] font-mono uppercase tracking-widest ml-2">Slow_Motion</span>
          </Button>

          <Separator variant="cyber" thickness="thin" className="my-1 opacity-20" />

          {/* Intensity Slider */}
          <div className="px-2 py-2 flex flex-col gap-2.5">
            <div className="flex justify-between items-center px-0.5">
              <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-[0.15em]">Luma_Intensity</span>
              <span className="text-[8px] font-mono text-cyan-400">{intensity.toFixed(1)}x</span>
            </div>
            <Slider 
              variant="cyber"
              min={0} 
              max={3} 
              step={0.1} 
              value={[intensity]} 
              onValueChange={([val]) => setIntensity(val!)}
              className="w-full"
            />
          </div>

          <Separator variant="cyber" thickness="thin" className="my-1 opacity-20" />

          {/* Quick Actions */}
          <div className="flex gap-1 mb-4">
            <Button 
              variant={isCapturing ? 'cyber' : 'ghost'}
              size="sm"
              onClick={takeScreenshot}
              className="flex-1 h-8 text-zinc-400 hover:text-cyan-400 border-none group/snap"
              title="Save PNG Screenshot"
            >
              <Icons.Camera size={14} className={`transition-transform duration-300 ${isCapturing ? 'scale-75 text-cyan-400' : 'group-hover/snap:scale-110'}`} />
            </Button>

            <Button 
              variant={isResetting ? 'cyber' : 'ghost'}
              size="sm"
              onClick={resetCamera}
              className="flex-1 h-8 text-zinc-400 hover:text-cyan-400 border-none group/reset"
              title="Reset Camera"
            >
              <Icons.Refresh size={14} className={`transition-transform duration-700 ${isResetting ? 'rotate-[360deg] text-cyan-400' : 'group-hover/reset:rotate-[-90deg]'}`} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
