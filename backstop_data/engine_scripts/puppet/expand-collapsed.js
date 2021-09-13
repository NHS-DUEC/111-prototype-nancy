module.exports = async (page, scenario, vp) => {
  console.log('SCENARIO > ' + scenario.label);
  await require('./clickAndHoverHelper')(page, scenario);

  console.log( 'Expanding collapsed items' );

  await page.evaluate(() => {
    let elements = document.getElementsByClassName('collapse-title');
    for (let element of elements)
        element.click();
    });

  console.log( 'Done' );

};
