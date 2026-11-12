import { useEffect, useState } from 'react'
import profileSmall from './profile-288.jpg'
import profileLarge from './profile-576.jpg'

type Skill = { name: string; level: number; category: string }
type GitHubRepo = { id: number; name: string; html_url: string; description: string | null; language: string | null; stargazers_count: number; forks_count: number; homepage: string | null; fork: boolean; has_pages?: boolean }

const skills: Skill[] = [
  { name: 'HTML5', level: 95, category: 'Front-end' },
  { name: 'CSS3', level: 92, category: 'Front-end' },
  { name: 'Bootstrap', level: 90, category: 'Front-end' },
  { name: 'JavaScript', level: 90, category: 'Front-end' },
  { name: 'jQuery', level: 82, category: 'Front-end' },
  { name: 'React', level: 88, category: 'Front-end' },
  { name: 'TypeScript', level: 86, category: 'Front-end' },
  { name: 'PHP', level: 88, category: 'Back-end' },
  { name: 'MySQL', level: 85, category: 'Back-end' },
  { name: 'Java', level: 78, category: 'Back-end' },
]

function safeExternalUrl(value: string | null, requiredOrigin?: string) {
  if (!value) return undefined
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password) return undefined
    if (requiredOrigin && url.origin !== requiredOrigin) return undefined
    return url.href
  } catch {
    return undefined
  }
}

function ProjectScreenshot({ name, src }: { name: string; src: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <p className="project-screenshot-status">Captura indisponível.</p>

  return (
    <img
      className="project-screenshot"
      src={src}
      alt={'Captura de tela de ' + name}
      width={800}
      height={450}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

const tarscallsScreens = [
  { file: 'comunidade.jpg', label: 'Painel inicial', alt: 'Painel do TarScalls com servidores, transmissões e controles de chamada rápida' },
  { file: 'descobrir.jpg', label: 'Comunidades', alt: 'Área de descoberta de servidores do TarScalls' },
  { file: 'acesso.png', label: 'Acesso', alt: 'Tela de acesso e cadastro do TarScalls' },
]

function isTarscalls(repo: GitHubRepo) {
  return /^tarscalls(?:-showcase)?$/i.test(repo.name)
}

function FeaturedProject({ repo }: { repo?: GitHubRepo }) {
  const [selected, setSelected] = useState(0)
  const screen = tarscallsScreens[selected]
  const screenshot = import.meta.env.BASE_URL + 'tarscalls/' + screen.file
  const codeUrl = safeExternalUrl(repo?.html_url ?? null, 'https://github.com')
  const homepage = safeExternalUrl(repo?.homepage ?? null)

  return (
    <article className="featured-project" id="tarscalls" aria-labelledby="tarscalls-title">
      <div className="featured-project-copy">
        <p className="eyebrow">Projeto em destaque</p>
        <h3 id="tarscalls-title">TarScalls</h3>
        <p>Plataforma de comunidades com canais de texto, chamadas de voz e vídeo, compartilhamento de tela e publicações.</p>
        <div className="tags"><span>TypeScript</span><span>Node.js</span><span>SQLite</span><span>WebRTC</span></div>
        {(homepage || codeUrl) && (
          <div className="project-links">
            {homepage && <a href={homepage} target="_blank" rel="noopener noreferrer">Abrir TarScalls ↗</a>}
            {codeUrl && <a href={codeUrl} target="_blank" rel="noopener noreferrer">Ver no GitHub ↗</a>}
          </div>
        )}
      </div>
      <div className="featured-project-gallery">
        <figure>
          <a href={screenshot} target="_blank" rel="noopener noreferrer" aria-label={'Ampliar captura: ' + screen.label}>
            <img src={screenshot} width={1440} height={900} loading="lazy" decoding="async" alt={screen.alt} />
          </a>
          <figcaption aria-live="polite">{screen.label} · Captura da aplicação</figcaption>
        </figure>
        <div className="featured-project-controls" role="group" aria-label="Telas do TarScalls">
          {tarscallsScreens.map(({ file, label }, index) => (
            <button key={file} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function App() {
  const [liveProject, setLiveProject] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(true)
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [reposLoading, setReposLoading] = useState(true)
  const [reposError, setReposError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const refreshInterval = 5 * 60 * 1000
    let lastAttempt = -Infinity
    let refreshing = false

    async function refreshRepos() {
      if (document.hidden || refreshing || performance.now() - lastAttempt < refreshInterval) return

      refreshing = true
      lastAttempt = performance.now()

      try {
        const repos = new Map<number, GitHubRepo>()
        const pageSize = 100
        for (let page = 1; ; page++) {
          const response = await fetch(
            `https://api.github.com/users/tieucro/repos?type=owner&sort=updated&direction=desc&per_page=${pageSize}&page=${page}`,
            {
              headers: { Accept: 'application/vnd.github+json' },
              cache: 'no-cache',
              signal: controller.signal,
            },
          )
          if (!response.ok) throw new Error('GitHub API request failed')

          const data: GitHubRepo[] = await response.json()
          for (const repo of data) {
            if (!repo.fork) repos.set(repo.id, repo)
          }
          if (data.length < pageSize) break
        }

        if (controller.signal.aborted) return
        setGithubRepos(Array.from(repos.values()))
        setReposError(false)
      } catch {
        if (!controller.signal.aborted) setReposError(true)
      } finally {
        refreshing = false
        if (!controller.signal.aborted) setReposLoading(false)
      }
    }

    void refreshRepos()
    const timer = window.setInterval(refreshRepos, refreshInterval)
    document.addEventListener('visibilitychange', refreshRepos)
    return () => {
      controller.abort()
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', refreshRepos)
    }
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('section-entered')
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.08 })

    const targets = '.section-label, #sobre .row > div, #skills .row > :first-child, .skill, #projetos h2, .github-project-card, #contato h2'
    document.querySelectorAll(targets).forEach(element => {
      if (!element.classList.contains('section-entered')) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [githubRepos])

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  return (
    <div className="portfolio-app">
      <header className="navbar-wrap">
        <nav className="container navbar navbar-expand-lg navbar-dark py-3">
          <a className="navbar-brand fw-bold" href="#home">TS<span>.</span></a>
          <button className="navbar-toggler" type="button" aria-controls="nav" aria-expanded={menuOpen} aria-label="Alternar menu de navegação" onClick={() => setMenuOpen(open => !open)}>
            <span className="navbar-toggler-icon" />
          </button>
          <div className={menuOpen ? "collapse navbar-collapse show" : "collapse navbar-collapse"} id="nav">
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <a className="nav-link" onClick={() => setMenuOpen(false)} href="#home">Início</a>
              <a className="nav-link" onClick={() => setMenuOpen(false)} href="#sobre">Sobre</a>
              <a className="nav-link" onClick={() => setMenuOpen(false)} href="#skills">Habilidades</a>
              <a className="nav-link" onClick={() => setMenuOpen(false)} href="#projetos">Projetos</a>
              <a className="nav-link" onClick={() => setMenuOpen(false)} href="#contato">Contato</a>
              <button className="theme-btn" onClick={() => setDark(v => !v)} aria-label="Alternar tema">{dark ? '☼' : '☾'}</button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="hero container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7 order-2 order-lg-1">
              <p className="eyebrow">FULL STACK DEVELOPER</p>
              <h1>Transformo ideias em <span>soluções digitais.</span></h1>
              <p className="hero-text">Desenvolvedor focado na criação de aplicações web modernas, responsivas e escaláveis, unindo front-end, back-end e banco de dados.</p>
              <div className="d-flex flex-wrap gap-3">
                <a className="btn btn-primary-custom" href="#tarscalls">Conhecer TarScalls <span>→</span></a>
                <a className="btn btn-outline-custom" href="#contato">Entrar em contato</a>
              </div>
              <div className="mini-stack mt-4"><span>HTML</span><span>CSS</span><span>JS</span><span>TS</span><span>PHP</span><span>React</span></div>
            </div>
            <div className="col-lg-5 order-1 order-lg-2 text-center">
              <div className="profile-orbit">
                <div className="profile-ring" />
                <img src={profileSmall} srcSet={profileSmall + " 1x, " + profileLarge + " 2x"} width={288} height={288} fetchPriority="high" alt="Foto de perfil profissional de Tarciano Silva" className="profile-photo" />
                <div className="profile-card-orbit">
                  <div className="floating-card fc-one">&lt;/&gt; <strong>Code</strong></div>
                  <div className="floating-card fc-two">✦ <strong>Full Stack</strong></div>
                  <div className="floating-card fc-three">✦ <strong>Prompt Engineer</strong></div>
                </div>
              </div>
            </div>
          </div>
          <a className="section-scroll" href="#sobre" aria-label="Descer para a seção Sobre" />
        </section>

        <section id="sobre" className="section container">
          <div className="section-label">SOBRE</div>
          <div className="row g-5 align-items-center">
            <div className="col-lg-7">
              <h2>Desenvolvimento com visão de <span>produto.</span></h2>
              <p>Meu objetivo é criar experiências digitais que sejam bonitas, rápidas e funcionais. Trabalho da interface ao banco de dados, buscando código organizado e soluções que possam evoluir junto com o projeto.</p>
              <p>Tenho experiência com tecnologias do ecossistema web e gosto de transformar problemas complexos em interfaces simples para quem utiliza.</p>
            </div>
            <div className="col-lg-5">
              <div className="about-card"><div className="stat"><strong>10+</strong><span>Tecnologias</span></div><div className="stat"><strong>Full</strong><span>Stack</span></div><div className="stat"><strong>∞</strong><span>Ideias para criar</span></div></div>
            </div>
          </div>
          <a className="section-scroll" href="#skills" aria-label="Descer para a seção Habilidades" />
        </section>

        <section id="skills" className="section section-alt">
          <div className="container">
            <div className="section-label">HABILIDADES</div>
            <div className="row g-5">
              <div className="col-lg-5"><h2>Minha <span>stack.</span></h2><p>Um conjunto de tecnologias para construir aplicações completas, do layout à persistência dos dados.</p></div>
              <div className="col-lg-7">
                <div className="skill-grid">
                  {skills.map(skill => <div className="skill" key={skill.name}><div className="skill-head"><span>{skill.name}</span><small>{skill.level}%</small></div><progress className="skill-progress" value={skill.level} max={100} aria-label={skill.name} /><small className="category">{skill.category}</small></div>)}
                </div>
              </div>
            </div>
          </div>
          <a className="section-scroll" href="#projetos" aria-label="Descer para a seção Projetos" />
        </section>

        <section id="projetos" className="section container">
          <div className="section-label">PROJETOS</div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4"><div><h2>Meus projetos <span>no GitHub.</span></h2><p className="mb-1">Repositórios públicos carregados diretamente do meu perfil.</p></div><a className="github-profile-link" href="https://github.com/tieucro" target="_blank" rel="noopener noreferrer">Ver perfil completo ↗</a></div>
          <FeaturedProject repo={githubRepos.find(isTarscalls)} />
          {reposLoading && <p role="status" className="repo-status">Carregando projetos do GitHub…</p>}
          {reposError && <div className="repo-status" role="status">Não foi possível atualizar os projetos agora. Você pode acessá-los diretamente no <a href="https://github.com/tieucro?tab=repositories" target="_blank" rel="noopener noreferrer">perfil do GitHub</a>.</div>}
          {!reposLoading && !reposError && githubRepos.length === 0 && <p className="repo-status">Nenhum repositório público próprio foi encontrado. Confira o <a href="https://github.com/tieucro" target="_blank" rel="noopener noreferrer">perfil do GitHub</a>.</p>}
          <div className="row g-4">
            {githubRepos.filter(repo => !isTarscalls(repo)).map(repo => {
              const codeUrl = safeExternalUrl(repo.html_url, 'https://github.com')
              const pagesUrl = repo.has_pages
                ? repo.name.toLowerCase() === 'tieucro.github.io'
                  ? 'https://tieucro.github.io/'
                  : 'https://tieucro.github.io/' + encodeURIComponent(repo.name) + '/'
                : undefined
              const homepage = safeExternalUrl(repo.homepage) ?? pagesUrl
              const screenshot = homepage
                ? 'https://image.thum.io/get/width/800/crop/675/noanimate/?url=' + encodeURIComponent(homepage)
                : undefined
              const isLive = liveProject === repo.id

              return (
                <div className={isLive ? 'col-12' : 'col-md-6 col-lg-4'} key={repo.id}>
                  <article className="project-card github-project-card">
                    {screenshot && !isLive && <ProjectScreenshot key={screenshot} name={repo.name} src={screenshot} />}
                    <h3>{repo.name.replace(/[-_]/g, ' ')}</h3>
                    <p>{repo.description || 'Repositório público de código. Acesse o GitHub para ver os arquivos e detalhes do projeto.'}</p>
                    <div className="tags">
                      {repo.language && <span>{repo.language}</span>}
                      <span>★ {repo.stargazers_count}</span>
                      <span>⑂ {repo.forks_count}</span>
                    </div>
                    <div className="project-links">
                      {homepage && (
                        <button
                          type="button"
                          className="project-demo-toggle"
                          aria-expanded={isLive}
                          onClick={() => setLiveProject(isLive ? null : repo.id)}
                        >
                          {isLive ? 'Fechar demonstração' : 'Testar ao vivo'}
                        </button>
                      )}
                      {homepage && <a className="project-demo-link" href={homepage} target="_blank" rel="noopener noreferrer">Abrir site do projeto ↗</a>}
                      {codeUrl && <a href={codeUrl} target="_blank" rel="noopener noreferrer">Ver código ↗</a>}
                    </div>
                    {isLive && homepage && (
                      <iframe
                        className="project-live-frame"
                        title={'Demonstração de ' + repo.name}
                        src={homepage}
                        sandbox="allow-scripts allow-forms"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </article>
                </div>
              )
            })}
          </div>
          <a className="section-scroll" href="#contato" aria-label="Descer para a seção Contato" />
        </section>

        <section id="contato" className="contact-section">
          <div className="container text-center">
            <div className="section-label">CONTATO</div>
            <h2>Vamos construir algo <span>incrível?</span></h2>
            <p>Estou aberto a projetos, oportunidades e novas conexões profissionais.</p>
            <a className="btn btn-primary-custom mt-3" href="mailto:tarcianobezerra2@gmail.com">Enviar mensagem ✉</a>
            <div className="socials mt-4"><a href="https://github.com/tieucro" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://www.linkedin.com/in/tarciano-bezerra-957698246/" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="mailto:tarcianobezerra2@gmail.com">E-mail</a></div>
          </div>
        </section>
      </main>
      <footer><div className="container d-flex justify-content-between flex-wrap gap-2"><span>© 2026 Tarciano Silva</span><span>Full Stack Developer · Brasil</span></div></footer>
    </div>
  )
}
