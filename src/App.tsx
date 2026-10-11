import { useEffect, useState } from 'react'
import $ from 'jquery'

type Skill = { name: string; level: number; category: string }
type GitHubRepo = { id: number; name: string; html_url: string; description: string | null; language: string | null; stargazers_count: number; forks_count: number; updated_at: string; homepage: string | null; fork: boolean }

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

export default function App() {
  const [dark, setDark] = useState(true)
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [reposLoading, setReposLoading] = useState(true)
  const [reposError, setReposError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    fetch('https://api.github.com/users/tieucro/repos?type=owner&sort=updated&per_page=100', {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
      .then(response => {
        if (!response.ok) throw new Error('Não foi possível carregar os repositórios')
        return response.json() as Promise<GitHubRepo[]>
      })
      .then(data => setGithubRepos(data.filter(repo => !repo.fork).sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))))
      .catch(error => { if (error.name !== 'AbortError') setReposError(true) })
      .finally(() => setReposLoading(false))
    return () => controller.abort()
  }, [])

  useEffect(() => {
    $('html').attr('data-theme', dark ? 'dark' : 'light')
    $('.nav-link').on('click.smooth', function (e) {
      const target = $(this).attr('href')
      if (target?.startsWith('#')) {
        e.preventDefault()
        $(target)[0]?.scrollIntoView({ behavior: 'smooth' })
      }
    })
    return () => { $('.nav-link').off('.smooth') }
  }, [dark])

  return (
    <div className="portfolio-app">
      <header className="navbar-wrap">
        <nav className="container navbar navbar-expand-lg navbar-dark py-3">
          <a className="navbar-brand fw-bold" href="#home">TS<span>.</span></a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="nav">
            <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
              <a className="nav-link" href="#home">Início</a>
              <a className="nav-link" href="#sobre">Sobre</a>
              <a className="nav-link" href="#skills">Habilidades</a>
              <a className="nav-link" href="#projetos">Projetos</a>
              <a className="nav-link" href="#contato">Contato</a>
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
                <a className="btn btn-primary-custom" href="#projetos">Ver projetos <span>→</span></a>
                <a className="btn btn-outline-custom" href="#contato">Entrar em contato</a>
              </div>
              <div className="mini-stack mt-4"><span>HTML</span><span>CSS</span><span>JS</span><span>TS</span><span>PHP</span><span>React</span></div>
            </div>
            <div className="col-lg-5 order-1 order-lg-2 text-center">
              <div className="profile-orbit">
                <div className="profile-ring" />
                <img src="/profile.png" alt="Foto de perfil profissional de Tarciano Silva" className="profile-photo" />
                <div className="floating-card fc-one">&lt;/&gt; <strong>Code</strong></div>
                <div className="floating-card fc-two">✦ <strong>Full Stack</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className="section container">
          <div className="section-label">01 — SOBRE</div>
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
        </section>

        <section id="skills" className="section section-alt">
          <div className="container">
            <div className="section-label">02 — HABILIDADES</div>
            <div className="row g-5">
              <div className="col-lg-5"><h2>Minha <span>stack.</span></h2><p>Um conjunto de tecnologias para construir aplicações completas, do layout à persistência dos dados.</p></div>
              <div className="col-lg-7">
                <div className="skill-grid">
                  {skills.map(skill => <div className="skill" key={skill.name}><div className="skill-head"><span>{skill.name}</span><small>{skill.level}%</small></div><div className="progress"><div className="progress-bar" style={{ width: `${skill.level}%` }} /></div><small className="category">{skill.category}</small></div>)}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projetos" className="section container">
          <div className="section-label">03 — PROJETOS</div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4"><div><h2>Meus projetos <span>no GitHub.</span></h2><p className="mb-1">Repositórios públicos carregados diretamente do meu perfil.</p></div><a className="github-profile-link" href="https://github.com/tieucro" target="_blank" rel="noopener noreferrer">Ver perfil completo ↗</a></div>
          {reposLoading && <p role="status" className="repo-status">Carregando projetos do GitHub…</p>}
          {reposError && <div className="repo-status" role="status">Não foi possível carregar os projetos agora. Você pode acessá-los diretamente no <a href="https://github.com/tieucro?tab=repositories" target="_blank" rel="noopener noreferrer">perfil do GitHub</a>.</div>}
          {!reposLoading && !reposError && githubRepos.length === 0 && <p className="repo-status">Nenhum repositório público próprio foi encontrado. Confira o <a href="https://github.com/tieucro" target="_blank" rel="noopener noreferrer">perfil do GitHub</a>.</p>}
          <div className="row g-4">{githubRepos.map((repo, i) => <div className="col-md-6 col-lg-4" key={repo.id}><article className="project-card github-project-card"><div className="project-number">{String(i + 1).padStart(2, '0')}</div><div className="project-icon">⌘</div><h3>{repo.name.replace(/[-_]/g, ' ')}</h3><p>{repo.description || 'Repositório público de código. Acesse o GitHub para ver os arquivos e detalhes do projeto.'}</p><div className="tags">{repo.language && <span>{repo.language}</span>}<span>★ {repo.stargazers_count}</span><span>⑂ {repo.forks_count}</span></div><div className="project-links"><a href={repo.html_url} target="_blank" rel="noopener noreferrer">Ver código ↗</a>{repo.homepage && <a href={repo.homepage} target="_blank" rel="noopener noreferrer">Ver projeto ↗</a>}</div></article></div>)}</div>
        </section>

        <section id="contato" className="contact-section">
          <div className="container text-center">
            <div className="section-label">04 — CONTATO</div>
            <h2>Vamos construir algo <span>incrível?</span></h2>
            <p>Estou aberto a projetos, oportunidades e novas conexões profissionais.</p>
            <a className="btn btn-primary-custom mt-3" href="mailto:seuemail@exemplo.com">Enviar mensagem ✉</a>
            <div className="socials mt-4"><a href="https://github.com/tieucro" target="_blank" rel="noopener noreferrer">GitHub</a><a href="#">LinkedIn</a><a href="mailto:seuemail@exemplo.com">E-mail</a></div>
          </div>
        </section>
      </main>
      <footer><div className="container d-flex justify-content-between flex-wrap gap-2"><span>© 2026 Tarciano Silva</span><span>Full Stack Developer · Brasil</span></div></footer>
    </div>
  )
}
