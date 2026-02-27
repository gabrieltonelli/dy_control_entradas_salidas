**Requerimiento del Sistema de "Control de Ingresos y Egresos"**

El requerimiento actual corresponde al objetivo de lograr sistematizar
las entradas y salidas a través de los puntos de Vigilancia (Portería) y
Recepción.\
Parte de la premisa que las personas internas a la empresa cumplen un
horario de ingreso y un horario de egreso a su jornada laboral y ello ya
es registrado y gestionado por un sistema de huella y reconocimiento
fácil por parte de Recursos Humanos. Sin embargo, hay situaciones en los
que, en dicha franja horaria, el colaborador interno a la empresa, que
se encuentra físicamente en una dependencia, necesita salir tanto para
dirigirse a otra dependencia, a una reunión en exteriores, a una
atención médicos o de urgencia, por temas personales o generalizando: a
un destino en exteriores pudiendo retornar o no.\
Hasta el momento esas salidas se están registrando en dos formularios en
papel denominados F1 y F2 uno para, uno para salidas sin retorno y el
otro para salidas con retorno respectivamente.

Por otro lado, la empresa plantea la necesidad de registrar y realizar
el seguimiento de objetos, entendiendo como objetos cualquier tipo de
artículo de propiedad o no de la empresa como así también de
documentación.\
El paso por los puestos de vigilancia de cualquier dependencia de la
empresa puede implicar el traslado de artículos y/o documentos que
pueden requerir su devolución al área de origen o no.

En lo que respecta al puesto de Recepción, también se desea dar registro
y seguimiento a la entrada y salida de objetos tales como bultos que
llegan con destino a alguna persona interna u área o a bultos que deben
ser entregados a alguien que los retirará.\
\
C como requerimiento no tan prioritario, se planea registrar el ingreso
y egreso de visitantes externos.\
\
Vale destacar el que el movimiento de objetos debe vincularse a un
registro de movimiento, donde el movimiento será su agrupación y los
objetos los detalles. De tal forma se detectan tres entidades
principales Movimientos, Artículos y Documentos.

Algunos de los casos de uso detectados:

- un empleado sale de la planta a llevar una máquina a reparar

- un empleado lleva un artículo (ejemplo un repuesto) para devolverlo a
  un proveedor y vuelve con otro repuesto de reemplazo

- un empleado lleva un artículo (ejemplo un repuesto) para devolverlo a
  un proveedor y vuelve con varias máquinas reparadas

- un empleado sale en un vehículo de la empresa para llevar a otra
  planta dos máquinas que allí necesitan de forma urgente

- un chofer se ocupa de trasladar un repuesto desde un depósito hasta
  una de las plantas

- llegan nuevas herramientas en distintos bultos desde un proveedor con
  destino pañol

- llegan nuevas herramientas en distintos bultos desde un proveedor con
  destino mantenimiento (puede pasar esto sin pasar por pañol)

- un empleado sale de la planta por un accidente laboral y queda
  internado

- un proveedor llega hasta recepción a dejar unos paquetes que van a
  administración

- se deja en la recepción un paquete que retira un proveedor

- un empleado vuelve de una atención médica

- se deja en la recepción una serie de insumos (resmas, artículos de
  librería) desde una planta a otra

- un empleado que lleva a reparar un artículo, pero luego se va a otra
  planta

- un proveedor entrega en la recepción dos presupuestos para dos
  sectores distintos

- un empleado lleva documentación de forma habitual

- un empleado se traslada de una planta a la otra, lleva algunos
  documentos para dejar, insumos que también deja y una herramienta de
  medición con la que piensa volver

Con respecto a los objetos, tanto artículos como documentos, se desea
contar con una consulta con el estado general de ellos, por ejemplo:
saber cuántos objetos están pendientes de volver a su lugar de origen.\
\
Cada pantalla de listado o grilla debe contar con sus correspondientes
campos de filtrado combinables.

Con respecto al acceso, solo algunos usuarios de Office 365 con sus
emails corporativos pueden acceder a crear movimientos.

Por su parte el personal de Vigilancia y Recepción contarán con sus
propios roles para gestionar los registros de movimientos, artículos y
documentos para modificar estados, fecha y hora de registro entre otros.

No cualquier usuario debería poder autorizar a otra persona su salida o
ingreso (movimiento) con o sin objetos, sino que debe soportarse un
esquema de quien puede a quien (jefes, supervisores, directores,
gerentes, etc)\
\
Importante: es fundamental llevar auditoría de cada acción efectuada
sobre el sistema, quien hace qué, cuando y donde es fundamental para
llevar el control de los eventos.