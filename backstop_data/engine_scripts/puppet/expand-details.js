module.exports = async (page, scenario, vp) => {
  console.log('SCENARIO > ' + scenario.label);
  await require('./clickAndHoverHelper')(page, scenario);

  console.log( 'Expanding details tags' );

  await page.evaluate(() => {
    let elements = document.querySelectorAll('main#content summary');
    for (let element of elements)
        element.click();
    });

  console.log( 'Done' );

};
