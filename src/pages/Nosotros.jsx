const valores = [
  { titulo: 'Calidad', texto: 'Trabajamos solo con marcas reconocidas y productos con garantía.' },
  { titulo: 'Asesoría', texto: 'Te ayudamos a elegir el equipo que realmente necesitas.' },
  { titulo: 'Confianza', texto: 'Compras seguras, precios claros y despacho a todo Chile.' },
]

const cifras = [
  { valor: '+5.000', texto: 'clientes' },
  { valor: '+300', texto: 'productos' },
  { valor: '16', texto: 'regiones con despacho' },
]

function Nosotros() {
  return (
    <main className="container py-5">
      <section className="row align-items-center g-4 mb-5">
        <div className="col-lg-6">
          <h1 className="mb-3">Sobre Zthorken</h1>
          <p className="lead">
            Somos una tienda online chilena dedicada a la tecnología: computadores, notebooks, audio,
            periféricos, monitores y componentes.
          </p>
          <p>
            Nacimos con la idea de que comprar tecnología sea simple. Por eso seleccionamos cada producto,
            mostramos precios transparentes y acompañamos a nuestros clientes antes y después de su compra.
          </p>
        </div>
        <div className="col-lg-6">
          <img src="/img/nosotros.jpg" className="img-fluid rounded shadow-sm" alt="Equipo de Zthorken" />
        </div>
      </section>

      <section className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card h-100 border-primary">
            <div className="card-body">
              <h2 className="h4 text-primary">Misión</h2>
              <p className="mb-0">
                Acercar la tecnología a las personas con productos de calidad, buena asesoría y una
                experiencia de compra rápida y segura.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100 border-success">
            <div className="card-body">
              <h2 className="h4 text-success">Visión</h2>
              <p className="mb-0">
                Ser la tienda de tecnología online preferida en Chile, reconocida por la confianza y
                la cercanía con sus clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-5">
        <h2 className="text-center mb-4">Nuestros valores</h2>
        <div className="row g-4">
          {valores.map((v) => (
            <div className="col-md-4" key={v.titulo}>
              <div className="card h-100 text-center shadow-sm">
                <div className="card-body">
                  <h3 className="h5">{v.titulo}</h3>
                  <p className="mb-0">{v.texto}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-light rounded p-4">
        <div className="row text-center g-3">
          {cifras.map((c) => (
            <div className="col-md-4" key={c.texto}>
              <p className="display-6 fw-bold mb-0">{c.valor}</p>
              <p className="text-secondary mb-0">{c.texto}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Nosotros
