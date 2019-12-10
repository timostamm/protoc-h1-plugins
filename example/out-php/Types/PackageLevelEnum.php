<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: types.proto

namespace Types;

use UnexpectedValueException;

/**
 * Protobuf type <code>types.PackageLevelEnum</code>
 */
class PackageLevelEnum
{
    /**
     * Generated from protobuf enum <code>PKG_A = 0;</code>
     */
    const PKG_A = 0;
    /**
     * Generated from protobuf enum <code>PKG_B = 1;</code>
     */
    const PKG_B = 1;
    /**
     * Generated from protobuf enum <code>PKG_C = 2;</code>
     */
    const PKG_C = 2;

    private static $valueToName = [
        self::PKG_A => 'PKG_A',
        self::PKG_B => 'PKG_B',
        self::PKG_C => 'PKG_C',
    ];

    public static function name($value)
    {
        if (!isset(self::$valueToName[$value])) {
            throw new UnexpectedValueException(sprintf(
                    'Enum %s has no name defined for value %s', __CLASS__, $value));
        }
        return self::$valueToName[$value];
    }


    public static function value($name)
    {
        $const = __CLASS__ . '::' . strtoupper($name);
        if (!defined($const)) {
            throw new UnexpectedValueException(sprintf(
                    'Enum %s has no value defined for name %s', __CLASS__, $name));
        }
        return constant($const);
    }
}

