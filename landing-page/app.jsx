// Main app

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#3B82F6",
  "heroLayout": "stacked",
  "headline": "Pool service software your techs can run on day one",
  "subhead": "Pool service software for routes, chemistry tracking, repairs, and billing \u2014 all in one app your techs can use day one.",
  "density": "default",
  "theme": "light"
}/*EDITMODE-END*/;

const ACCENT_PRESETS = {
  '#3B82F6': 'Brand',
  '#1D4ED8': 'Indigo',
  '#0ea5e9': 'Pool',
  '#0f766e': 'Teal',
  '#7c3aed': 'Violet',
  '#18181b': 'Mono',
};

const App = () => {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // apply tweaks to body
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accent);
    // derive accent-ink as a slightly darker shade
    document.documentElement.style.setProperty('--accent-ink', `color-mix(in oklab, ${tweaks.accent} 80%, black)`);
    document.body.dataset.density = tweaks.density;
    document.body.dataset.theme = tweaks.theme;
  }, [tweaks]);

  return (
    <>
      <Nav accent={tweaks.accent}/>
      <Hero layout={tweaks.heroLayout} headline={tweaks.headline} subhead={tweaks.subhead}/>
      <LogoStrip/>
      <Migration/>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Brand">
          <div style={{ height: 4 }}/>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(ACCENT_PRESETS).map(([hex, name]) => (
              <button key={hex} onClick={() => setTweak('accent', hex)}
                title={name}
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: hex,
                  border: tweaks.accent === hex ? '2px solid var(--ink)' : '1px solid var(--line)',
                  cursor: 'pointer',
                  outline: tweaks.accent === hex ? '2px solid white' : 'none',
                  outlineOffset: -3,
                }}/>
            ))}
          </div>
          <TweakColor label="Custom accent" value={tweaks.accent} onChange={v => setTweak('accent', v)}/>
        </TweakSection>

        <TweakSection label="Hero">
          <TweakRadio label="Layout" value={tweaks.heroLayout} options={[
            { value: 'stacked', label: 'Stacked' },
            { value: 'split', label: 'Split' },
            { value: 'center', label: 'Center' },
            { value: 'proof', label: 'Proof' },
          ]} onChange={v => setTweak('heroLayout', v)}/>
          <TweakText label="Headline" value={tweaks.headline} onChange={v => setTweak('headline', v)}/>
          <TweakText label="Subhead" value={tweaks.subhead} onChange={v => setTweak('subhead', v)}/>
        </TweakSection>

        <TweakSection label="Page">
          <TweakRadio label="Theme" value={tweaks.theme} options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]} onChange={v => setTweak('theme', v)}/>
          <TweakRadio label="Density" value={tweaks.density} options={[
            { value: 'compact', label: 'Compact' },
            { value: 'default', label: 'Default' },
            { value: 'airy', label: 'Airy' },
          ]} onChange={v => setTweak('density', v)}/>
        </TweakSection>
      </TweaksPanel>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
