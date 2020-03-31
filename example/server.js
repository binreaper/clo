
const clo = require('..');

const router = clo();

router.get('/ping/:id', (req, res) => {
  return ["pong",req.params.id];
});


router.listen(8000, () => {
  console.log("listening");
});
