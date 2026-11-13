const SPRITE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
const TOTAL = 151;

const COLOR_TIPO = {
  normal: '#C9C9B8', fire: '#F5A25D', water: '#6CB4F0', electric: '#F7D54A',
  grass: '#7ED48C', ice: '#A6E3E9', fighting: '#E06C5E', poison: '#C98BE0',
  ground: '#DDBE7A', flying: '#B8A8F0', psychic: '#F58BB0', bug: '#BCD35C',
  rock: '#C4B26A', ghost: '#A08BBE', dragon: '#8F7AF0', dark: '#9C8577',
  steel: '#B8B8D0', fairy: '#F4B8D0',
};

const POKEMON = Array.from({ length: TOTAL }, (_, i) => ({ id: i + 1, capturado: false }));
POKEMON[0] = {
  id: 1, name: 'Bulbasaur', types: ['grass', 'poison'], capturado: true,
  height: '0.7 m', weight: '6.9 kg', abilities: ['Overgrow', 'Chlorophyll'],
  stats: { HP: 45, Attack: 49, Defense: 49, 'Sp. Atk': 65, 'Sp. Def': 65, Speed: 45 },
};

const MENSAJES = {
  ok:       { texto: '¡Pikachu fue agregado a tu Pokédex! ⚡', color: 'bg-green-400' },
  repetido: { texto: 'Este Pokémon ya había sido capturado.', color: 'bg-amber-400' },
  invalido: { texto: 'Este código QR no pertenece a la Pokédex.', color: 'bg-red-500' },
  conexion: { texto: 'No fue posible consultar la información del Pokémon.', color: 'bg-red-500' },
};
